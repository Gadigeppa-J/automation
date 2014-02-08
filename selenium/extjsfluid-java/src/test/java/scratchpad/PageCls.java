package scratchpad;

import org.extjsfluid.elements.ExtElement;
import org.extjsfluid.elements.ExtSelect;
import org.extjsfluid.elements.impl.internal.ElementFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;


public class PageCls {

	@FindBy(how=How.CSS, using = "#combobox-1013") 
	public ExtSelect EXT_CMB_STATE;
	
	public static PageCls get(WebDriver driver) {
		return ElementFactory.initElements(driver, PageCls.class);
	}
	
}
