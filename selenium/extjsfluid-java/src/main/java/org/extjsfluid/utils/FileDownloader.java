package org.extjsfluid.utils;

import org.extjsfluid.elements.ExtElement;
import org.openqa.selenium.JavascriptExecutor;



/**
 * @author Gadigeppa Jattennavar
 */
public class FileDownloader {
		
	private ExtElement element;
	private JavascriptExecutor js = null;
	private String fileName; 
	private String fileContents;
	private String fileType;
	private String statusText;
	private Long statusCode;
	private String contentLength;
	private Boolean isFileDownloaded = false;
	
	public FileDownloader(ExtElement element){
		this.element = element;		
		js = (JavascriptExecutor) element.getElementDriver();
	}
	
	private Object runScript(String function){
		String expr = "return ExtJsFluid.ajax";
		String script = expr + function + ";";
		
		//System.out.println(script);
		
		return js.executeScript(script);
	}
	
	public void downloadFile(){
		
		// reset ajax
		this.runScript(".reset();");
				
		// config ajax
		this.runScript(".setBlockNewWindow(true);");		
		
		// click element
		element.click();
		
		// wait for few seconds
		Wait.sleep(3000);	
		
		// request file
		this.fileName = (String) this.runScript(".requestFile();");
		
		/*
		// get filename
		this.fileName = (String) this.runScript(".getFileName();");
		
		// get fileContents
		this.fileContents = (String) this.runScript(".getFileContents();");
		
		// get fileType
		this.fileType = (String) this.runScript(".getFileContentType();");
		
		// get statusText
		this.statusText = (String) this.runScript(".getStatusText();");
		
		// get statusCode
		this.statusCode = (Long) this.runScript(".getStatusCode();");
		
		// get contentLength
		this.contentLength = (String) this.runScript(".getContentLength();");
		
		// is filedownloaded
		this.isFileDownloaded = (Boolean) this.runScript(".isFileDownloaded();");
		
		// reset ajax
		this.runScript(".reset();");		
		*/
	}
		
	public String getFileName(){
		this.fileName = (String) this.runScript(".getFileName();");
		return this.fileName;		
	}
	
	public String getFileContents(){
		this.fileContents = (String) this.runScript(".getFileContents();");
		return this.fileContents;		
	}

	public String getFileType(){
		this.fileType = (String) this.runScript(".getFileContentType();");
		return this.fileType;		
	}
	
	public String getStatusText(){
		this.statusText = (String) this.runScript(".getStatusText();");
		return this.statusText;		
	}
	
	public Long getStatuscode(){
		this.statusCode = (Long) this.runScript(".getStatusCode();");
		return this.statusCode;		
	}
	
	public String getContentLength(){
		this.contentLength = (String) this.runScript(".getContentLength();");
		return this.contentLength;		
	}
	
	public Boolean isDownloaded(){
		this.isFileDownloaded = (Boolean) this.runScript(".isFileDownloaded();");
		return this.isFileDownloaded;		
	}
	
}