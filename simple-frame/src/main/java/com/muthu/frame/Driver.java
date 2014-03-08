package com.muthu.frame;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * 
 * This class takes care for initializing WebDriver based on the browser name
 *
 */
public class Driver {

	/**
	 * Logger for logging
	 * 
	 * I'm using slf4j logger and not log4j.
	 * 
	 */
	private static Logger log = LoggerFactory.getLogger(Application.class); // pass the class name

	
	private static WebDriver driver;
	
	/**
	 * initializes Webdriver based on the browser name.
	 * 
	 * This Webdriver object will be stored in the static variable so that 
	 * it can be accessed by page object classes later.
	 * 
	 */
	
	public static WebDriver initialize(String browser){
		
		log.info("Opening {} browser", browser);
		
		switch (browser) {
		
		/* CHROME */
		case "chrome":
			driver = new ChromeDriver();
			break;

		/* FIREFOX */
		case "firefox":
			driver = new FirefoxDriver();
			break;
			
		/* IEXPLORE */
		case "iexplore":
			driver = new InternetExplorerDriver();
			break;
			
		default:
			throw new RuntimeException("Unknown browser " + browser);
			
		}
		
		
		driver.manage().window().maximize(); // maximize window
		driver.manage().timeouts().implicitlyWait(5000, TimeUnit.MILLISECONDS);
		
		
		return driver;
		
	}
	
	public static WebDriver getDriver(){
		return driver;
	}
	
}
