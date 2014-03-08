package com.muthu.scripts;


import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.muthu.frame.Application;
import com.muthu.pageclasses.FlipkartPage;
import com.muthu.pageclasses.LoginWindow;

public class FlipkartPageTests {

	@BeforeMethod
	public void setup(){
		// this code runs before each testcase
	}
	
	@Test
	public void testcase_001(){
		
		/**
		 * This test case verifies login functionality
		 * 
		 * Valid email
		 * Valid password
		 * 
		 */
		
		// Define your test data here
		String validEmail = ""; // add email here
		String validPassword = ""; // add password here
		
		// Launch the application
		// Notice that once the application is launched, launch() returns FlipkartPage object
		FlipkartPage flipkartPage = Application.launch();
		
		// Now click login button
		// Again notice click returns LoginWindow object
		LoginWindow loginWindow = flipkartPage.clickLogin();
		
		loginWindow.enterEmail(validEmail);
		
		loginWindow.enterPassword(validPassword);
		
		loginWindow.clickLogin();
		
		// Verify if Account button is displayed
		Assert.assertTrue(flipkartPage.isAccountButtonExists(), "Account button is displayed");
		
		// After login verify if login window is closed
		Assert.assertFalse(loginWindow.isWindowOpened(), "Login window is closed");
		
	}
	
	
	@AfterMethod
	public void teardown(){
		
		// this code runs after each testcase
		// here we can close our application
		
		Application.close();
		
	}
	
	
}
