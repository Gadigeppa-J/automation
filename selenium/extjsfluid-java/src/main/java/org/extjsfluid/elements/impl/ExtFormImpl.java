package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.ExtForm;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtFormImpl extends ExtElementImpl implements ExtForm{

    public ExtFormImpl(WebElement element) {
        super(element);
        
		// set expression
		setExpression(".getFormElement(arguments[0])");
    }

	@Override
	public boolean isEnabled() {
		return (boolean) runScript(".isEnabled()");
	}
	
	@Override
	public boolean isReadOnly() {
		return (boolean) runScript(".isReadOnly()");
	}

	@Override
	public boolean isEditable(){
		throw new RuntimeException("Used readonly instead for extjs form element");
	}
	
	@Override
	public WebElement getInputElement() {
		return (WebElement) runScript(".getInputElement()");
	}

	@Override
	public String getLabelText() {
		return (String) runScript(".getLabelText()");
	}

	@Override
	public void jsFocusInputEl() {
		runScript(".focusInputEl()");
	}

	@Override
	public void jsBlurInputEl() {
		runScript(".blurInputEl()");
	}

	@Override
	public void jsMouseoverInputEl() {
		runScript(".mouseoverInputEl()");		
	}
	
	@Override
	public boolean isDisplayed(){
		return (boolean) runScript(".isVisible()");
	}
}
