package org.extjsfluid.elements;

import java.util.List;

import org.extjsfluid.elements.impl.ExtElementImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtElementImpl.class)
public interface ExtElement extends Element {
	
	public String getClassName();
	
	public String hasClass();
	
	public List<WebElement> getChildElementsByClassName(String className);
	
	public List<WebElement> getVisibleChildElementsByClassName(String className);
	
	public String getDataQtip();
	
	public void jsClick();
	
	public void jsMouseover(boolean enabledRelatedTarget);
	
	public void jsMouseout(boolean enabledRelatedTarget);
	
	public void jsFocus();
	
	public void jsBlur();
	
	//boolean isDisplayed();
	boolean isVisible();
	
}
