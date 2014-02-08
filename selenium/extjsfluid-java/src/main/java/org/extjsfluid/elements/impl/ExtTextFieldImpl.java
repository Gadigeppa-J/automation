package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.ExtTextField;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtTextFieldImpl extends ExtFormImpl implements ExtTextField{

    public ExtTextFieldImpl(WebElement element) {
        super(element);
        
		// set expression
		setExpression(".getTextField(arguments[0])");
    }

	@Override
    public String getValue(){
    	return (String) runScript(".getValue()");
    }
    
	@Override
	public String getErrorString() {
		return (String) runScript(".getErrorString()");
	}

	@Override
	public String getErrorString(String msgTarget) {
		
		// valid msgTarget: side
		
		return (String) runScript(String.format(".getErrorString('%s')", msgTarget));
	}
	
	@Override
	public String getPlaceHolder() {
		return (String) runScript(".getPlaceHolder()");
	}
	
    @Override
    public void clear() {
    	WebElement textEl = getInputElement();    	
    	textEl.clear();
    }

    @Override
    public void set(String text) {
    	
    	WebElement textEl = getInputElement();
    	textEl.clear();
    	textEl.sendKeys(text);
    	    	
    }
    
    @Override
    public void enter(String text){
    	WebElement textEl = getInputElement();
    	textEl.sendKeys(text);
    	
    }
	
}
