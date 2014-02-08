package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.Element;
import org.extjsfluid.elements.ExtDisplayField;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtDisplayFieldImpl extends ExtFormImpl implements ExtDisplayField{
	
    public ExtDisplayFieldImpl(WebElement element) {
        super(element);
        
		// set expression
		setExpression(".getDisplayField(arguments[0])");
    }

	@Override
	public Element getDisplayElement() {
		WebElement webElement = (WebElement) runScript(".getDisplayElement()");
				
		Element element = new ElementImpl(webElement);
		
		return element;
	}
	
	@Override
	public String getDisplayText() {
		return (String) runScript(".getDisplayText()");
	}
	
}
