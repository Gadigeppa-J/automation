package com.muthu.pageclasses;

import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.muthu.frame.Driver;
import com.muthu.htmlobjects.HTMLElement;

/**
 * 
 * Page object class for Login window
 */
public class LoginWindow {

	/**
	 * Logger for logging
	 * 
	 * I'm using slf4j logger and not log4j.
	 * 
	 */
	private static Logger log = LoggerFactory.getLogger(LoginWindow.class); // pass the class name
	

	/**
	 * Get Webdriver
	 */
	WebDriver d = Driver.getDriver();

	/**
	 *  Define page objects here 
	 */

	/* Email field in login window */	
	private HTMLElement txtEmail = new HTMLElement("login.email.textfield");

	/* Password field in login window */
	private HTMLElement txtPassword = new HTMLElement("login.password.textfield");

	/* Login button in login window */
	private HTMLElement btnLogin = new HTMLElement("login.submit.button");

	// you can continue defining other objects here
	// ...
	// ...	
	
	/**
	 * Define page methods here
	 * 
	 * These are the only field that can be accessed by outside world
	 * These methods mimics user actions like clicking the login button..
	 * 
	 */
	
	public boolean isWindowOpened(){
		
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		
		// Determines if LoginWindow is opened
		// it checks if email field, password field & login button exists
		// If these objects exists then returns 'true' else 'false'

		if(isUsernameFieldExists() && isPasswordFieldExists() && isLoginButtonExists()){
			return true;
		}else{
			return false;
		}
		
	}
	
	public boolean isUsernameFieldExists(){
		return txtEmail.isDisplayed();
	}
	
	public boolean isPasswordFieldExists(){
		return txtPassword.isDisplayed();
	}
	
	public boolean isLoginButtonExists(){
		return btnLogin.isDisplayed();
	}
	
	public void enterEmail(String text){
		txtEmail.sendKeys(text);
		log.info("Entered {} in email field", text);
	}
	
	public void enterPassword(String text){
		txtPassword.sendKeys(text);
		log.info("Entered {} in username field", text);
	}
	
	public void clickLogin(){
		btnLogin.click();	
		log.info("Clicked Login button");
	}
}
