package com.muthu.pageclasses;

import org.eclipse.jetty.websocket.WebSocketFactory.Acceptor;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.muthu.frame.Driver;
import com.muthu.htmlobjects.HTMLElement;



/**
 * 
 * Page object class for Flipkart main page
 *
 */
public class FlipkartPage {

	/**
	 * Logger for logging
	 * 
	 * I'm using slf4j logger and not log4j.
	 * 
	 */
	private static Logger log = LoggerFactory.getLogger(FlipkartPage.class); // pass the class name


	/**
	 * Get Webdriver
	 */
	WebDriver d = Driver.getDriver();

	/**
	 *  Define page objects here 
	 */

	/* Search text field */
	private HTMLElement txtSearch = new HTMLElement("main.search.textfield");

	/* Login button in main page */
	private HTMLElement btnLogin = new HTMLElement("main.login.button");

	/* Account button (this comes after login) */
	private HTMLElement btnAccount = new HTMLElement("main.account.button");

	/* Logout button (this comes after clicking account button) */
	private HTMLElement btnLogout = new HTMLElement("main.logout.button");
	
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

	public boolean isPageOpened(){

		// Determines if main page is opened
		// returns 'true' if opened else 'false'

		// We can check if page is opened by checking if Search textfield exists
		if(isSearchFieldExists()){
			return true;
		}else{
			return false;
		}
	}

	public boolean isLoginButtonExists(){
		return btnLogin.isDisplayed();
	}

	public LoginWindow clickLogin(){	

		/**
		 * This function appears to have too many line for just simple click functionality
		 * But in reality its just three line code.
		 * Here I have just elaborated it for better understanding
		 */

		// Click login button
		btnLogin.click();

		// Log the step
		log.info("Clicked login button");


		/**
		 * When we click login button, Login window opens
		 * So we have to make sure that login window is opened
		 * and return the LoginWindow object back
		 * 
		 */

		LoginWindow loginWindow = new LoginWindow(); // create LoginWindow object

		// Check if Login Window is opened
		if(loginWindow.isWindowOpened()){

			// if execution reaches here means Login window is opened
			// so now we can return LoginWindow object

			return loginWindow; 
		}else{

			// If not throw error
			throw new RuntimeException("Login Window is not opened");

		}

	}


	public boolean isSearchFieldExists(){		
		return txtSearch.isDisplayed();
	}

	public void enterSearch(String text){
		txtSearch.sendKeys(text);
	}

	public boolean isAccountButtonExists(){
		return btnAccount.isDisplayed();
	}
	
	public void clickAccount(){
		btnAccount.click();
	}

	public void mouseoverAccount(){
		btnAccount.mouseover();
		
	}
	
	public boolean isLogoutButtonExists(){
		return btnLogout.isDisplayed();
	}
	
	public void clickLogout(){
		btnLogout.click();
	}
	
	
	public void login(String email, String password){
		
		LoginWindow loginWindow = clickLogin();
		
		loginWindow.enterEmail(email);
		loginWindow.enterPassword(password);
		loginWindow.clickLogin();
		
		if(loginWindow.isWindowOpened()){
			throw new RuntimeException("Login window is not closed after clicking login button");
		}
		
	}
	
	public void logout(){
		
		if(isAccountButtonExists()){
		
			mouseoverAccount();
			
			if(!isLogoutButtonExists()){
				throw new RuntimeException("Logout button is not shown");
			}
			
			clickLogout();
			
		}else{
			log.info("Application is already logged out");
		}
		
	}
	
}
