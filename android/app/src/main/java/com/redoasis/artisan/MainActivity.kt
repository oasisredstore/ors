package com.redoasis.artisan

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.os.Bundle
import android.util.Log
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import java.io.InputStream

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        setupWebView()

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            // Load the offline entry point
            webView.loadUrl("file:///android_asset/www/index.html")
        }

        setupBackPressedDispatcher()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            
            allowFileAccess = true
            allowContentAccess = true
            
            // Critical for local file fetch()/XHR requests in modern WebViews
            @Suppress("DEPRECATION")
            allowFileAccessFromFileURLs = true
            @Suppress("DEPRECATION")
            allowUniversalAccessFromFileURLs = true
            
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                Log.d("WebView", "Loading URL: $url")
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                Log.e("WebViewError", "Failed to load ${request?.url}: ${error?.description}")
            }

            // Asset Resource Interception & SPA Route Mapping
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                val url = request?.url?.toString() ?: return super.shouldInterceptRequest(view, request)

                if (url.startsWith("file:///android_asset/www/")) {
                    val path = url.removePrefix("file:///android_asset/www/")
                    
                    // If the path lacks a file extension, attempt to map it for SPA routing
                    if (!path.contains(".") && path.isNotEmpty()) {
                        try {
                            // First attempt: Append .html (common for Next.js exports)
                            val htmlPath = "$path.html"
                            val stream: InputStream = view!!.context.assets.open("www/$htmlPath")
                            return WebResourceResponse("text/html", "UTF-8", stream)
                        } catch (e: Exception) {
                            try {
                                // Fallback: Return index.html for client-side routing
                                val fallbackStream: InputStream = view!!.context.assets.open("www/index.html")
                                return WebResourceResponse("text/html", "UTF-8", fallbackStream)
                            } catch (fallbackEx: Exception) {
                                Log.e("WebView", "Route mapping fallback failed for $url", fallbackEx)
                            }
                        }
                    }
                }
                return super.shouldInterceptRequest(view, request)
            }
        }
    }

    private fun setupBackPressedDispatcher() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack() // Navigate back in WebView history
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed() // Exit app
                }
            }
        })
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState) // Preserve state on rotation
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        webView.restoreState(savedInstanceState)
    }
}
