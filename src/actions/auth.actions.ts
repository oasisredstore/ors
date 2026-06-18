"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import {
  LoginSchema,
  RegisterSchema,
  ArtisanRegisterSchema,
  ProviderRegisterSchema,
} from "@/lib/validations/auth.schema";
import { Role } from "@prisma/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user || !user.isActive) {
    return { error: "Invalid email or password" };
  }

  const passwordMatch = await bcrypt.compare(
    parsed.data.password,
    user.passwordHash
  );

  if (!passwordMatch) {
    return { error: "Invalid email or password" };
  }

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    // B4 FIX: Include firstName so the UI can greet users by name
    // rather than slicing their email address at the @ sign.
    firstName: user.firstName,
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return { success: true, role: user.role };
}

export async function registerAction(formData: FormData) {
  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: (formData.get("phone") as string) || undefined,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      passwordHash,
      phone: parsed.data.phone,
      role: "CUSTOMER",
    },
  });

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    // B4 FIX: Include firstName so the UI can greet users by name.
    firstName: user.firstName,
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

export async function artisanRegisterAction(formData: FormData) {
  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: (formData.get("phone") as string) || undefined,
    shopName: formData.get("shopName") as string,
    bio: (formData.get("bio") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
    specialization: (formData.get("specialization") as string) || undefined,
  };

  const parsed = ArtisanRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  // A3 FIX: The while-loop check + insert is a TOCTOU race — two concurrent
  // registrations with the same shop name can both pass the uniqueness check
  // before either commits. We now retry on a Prisma P2002 unique-constraint
  // error instead of trusting the pre-flight query alone.
  const baseSlug = slugify(parsed.data.shopName);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.artisan.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  let user;
  let attempt = 0;
  while (true) {
    try {
      user = await prisma.user.create({
        data: {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          passwordHash,
          phone: parsed.data.phone,
          role: "ARTISAN",
          artisan: {
            create: {
              shopName: parsed.data.shopName,
              slug,
              bio: parsed.data.bio,
              location: parsed.data.location,
              specialization: parsed.data.specialization,
              isApproved: false,
            },
          },
        },
        include: { artisan: true },
      });
      break; // success
    } catch (err: unknown) {
      // A3 FIX: If a concurrent request won the race and inserted the same
      // slug, Prisma throws a P2002 unique-constraint error. Retry with the
      // next counter value (max 10 attempts before giving up).
      const isPrismaUniqueError =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: string }).code === "P2002";
      if (isPrismaUniqueError && attempt < 10) {
        slug = `${baseSlug}-${++counter}`;
        attempt++;
        continue;
      }
      throw err;
    }
  }
  // Automated Subscription Fee Message
  const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (adminUser && user.artisan) {
    const subFeeMsg = `مرحباً بك في منصة قورارة للحرف! يرجى دفع حقوق الاشتراك الرمزية لتفعيل حسابك والاستفادة من كافة الخدمات.\n\nWelcome to Gourara Crafts! Please pay the symbolic subscription fee to activate your account and benefit from all services.`;
    await prisma.conversation.create({
      data: {
        touristId: adminUser.id,
        artisanId: user.artisan.id,
        subject: "تفعيل الحساب / Account Activation",
        messages: {
          create: {
            senderId: adminUser.id,
            body: subFeeMsg,
          }
        }
      }
    });
  }
  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    // B4 FIX: Include firstName so the UI can greet users by name.
    firstName: user.firstName,
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

export async function providerRegisterAction(formData: FormData) {
  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: (formData.get("phone") as string) || undefined,
    role: formData.get("role") as string,
    businessName: formData.get("businessName") as string,
    description: (formData.get("description") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
  };

  const parsed = ProviderRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const baseSlug = slugify(parsed.data.businessName);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.serviceProvider.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  let user;
  let attempt = 0;
  while (true) {
    try {
      user = await prisma.user.create({
        data: {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          passwordHash,
          phone: parsed.data.phone,
          role: parsed.data.role as Role,
          serviceProvider: {
            create: {
              businessName: parsed.data.businessName,
              slug,
              description: parsed.data.description,
              location: parsed.data.location,
              contactEmail: parsed.data.email,
              contactPhone: parsed.data.phone,
              isApproved: false,
            },
          },
        },
        include: { serviceProvider: true },
      });
      break;
    } catch (err: unknown) {
      const isPrismaUniqueError =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: string }).code === "P2002";
      if (isPrismaUniqueError && attempt < 10) {
        slug = `${baseSlug}-${++counter}`;
        attempt++;
        continue;
      }
      throw err;
    }
  }
  // Automated Subscription Fee Message
  const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (adminUser && user.serviceProvider) {
    const subFeeMsg = `مرحباً بك في منصة قورارة للحرف! يرجى دفع حقوق الاشتراك الرمزية لتفعيل حسابك والاستفادة من كافة الخدمات.\n\nWelcome to Gourara Crafts! Please pay the symbolic subscription fee to activate your account and benefit from all services.`;
    await prisma.conversation.create({
      data: {
        touristId: adminUser.id,
        providerId: user.serviceProvider.id,
        subject: "تفعيل الحساب / Account Activation",
        messages: {
          create: {
            senderId: adminUser.id,
            body: subFeeMsg,
          }
        }
      }
    });
  }
  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

// A8 FIX: Accept the current locale so that Arabic users are redirected to
// /ar instead of being unconditionally sent to the hardcoded /en route.
export async function logoutAction(locale: string = "en") {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect(`/${locale}`);
}
