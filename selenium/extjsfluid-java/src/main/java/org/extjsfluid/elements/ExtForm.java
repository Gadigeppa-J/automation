package org.extjsfluid.elements;

import org.extjsfluid.elements.impl.ExtFormImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtFormImpl.class)
public interface ExtForm extends ExtElement{
	
	boolean isReadOnly();
	
	WebElement getInputElement();
	
	String getLabelText();
	
	void jsFocusInputEl();
	
	void jsBlurInputEl();
	
	void jsMouseoverInputEl();
}
