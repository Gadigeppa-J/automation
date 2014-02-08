package org.extjsfluid.elements.javascript;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

/**
 * @author Gadigeppa Jattennavar
 */
public class JSScriptInject {
	
	  public static String readJavaScriptResource(final String cpResourcePath) {
			
			StringBuilder sb = new StringBuilder();
			
			try{

				sb.append(FileUtils.readFileToString(new File(cpResourcePath)));
			}catch(Exception e){
				throw new RuntimeException(e.getMessage());
			}
			
			return sb.toString();
		  }
	
	  public static void injectSupportingJavaScript(String[] resources, WebDriver driver) {

		    JavascriptExecutor js = (JavascriptExecutor) driver;
		  
		    try {
		      //final String[] resources = new String[] { "seleniumFunctionUtil.js" };

		      try {
		        //JavascriptInjection.injectJavaScriptResourcesTogether( resources, new String[0], "ff-Extjs-javascript", selenium);
		        injectJavaScriptResource(resources[0], js);
		      } catch (final Throwable e) {

		        try {
		          for (int i = 0; i < resources.length; i++) {
		            injectJavaScriptResource(resources[i], js);
		          }
		        } catch (final Throwable e2) {
		          final StringBuilder emsg = new StringBuilder();
		          emsg.append("Unable to inject required Java Script as individual streams. ");

		        }
		      }

		    } catch (final Throwable e) {
		      if (RuntimeException.class.isInstance(e)) {
		        throw RuntimeException.class.cast(e);
		      } else {
		        throw new RuntimeException(e);
		      }
		    }
		  }
	
	  public static String inputStream2UTF8(final InputStream in) throws IOException {
		    String ret = null;
		    final BufferedInputStream bin = new BufferedInputStream(in);
		    final InputStreamReader isr = new InputStreamReader(bin, "UTF-8");
		    final StringBuilder sb = new StringBuilder();
		    int iread = -1;
		    while ((iread = isr.read()) != -1) {
		      sb.append((char) iread);
		    }
		    ret = sb.toString();
		    return ret;
		  }
	  
	  public static void injectJavaScriptResource(final String cpResourcePath, JavascriptExecutor js) {
		    final ArrayList<InputStream> closeables = new ArrayList<InputStream>();

		      final InputStream in = JSScriptInject.class.getResourceAsStream(cpResourcePath);
		      if (in != null) {
		        closeables.add(in);
		      }
		      try {
				final String injectScript = inputStream2UTF8(in);
				js.executeScript(injectScript);
				
			} catch (Exception e) {
				throw new RuntimeException(e.getMessage());
			}

		  }
	
}
