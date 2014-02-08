package scratchpad;

import java.sql.Driver;

import org.extjsfluid.utils.Wait;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;


public class TestCls {

	
	
	
	public static void main(String... args){
		
		System.setProperty("webdriver.chrome.driver", "C:\\Users\\Muthu\\workspace\\grid\\drivers\\chromedriver.exe");
		
		WebDriver d = new ChromeDriver();
		
		d.get("http://localhost:8080/EmptySite1/HTMLPage.html");
		
		Wait.sleep(5000);
		
		System.out.println("Initializing Page..");
		PageCls p = PageCls.get(d);
		System.out.println("Compaleted Initializing Page..");
		
		System.out.println("Getting Options..");
		System.out.println(p.EXT_CMB_STATE.getOptions());
		System.out.println("Printed Options..");
		
		p.EXT_CMB_STATE.selectByValue("Alaska");
	}
	
}
