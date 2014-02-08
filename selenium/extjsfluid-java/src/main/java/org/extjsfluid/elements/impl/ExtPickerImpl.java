package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.ExtPicker;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtPickerImpl extends ExtTextFieldImpl implements ExtPicker{
	
    public ExtPickerImpl(WebElement element) {
        super(element);
        
		// set expression
		setExpression(".getPicker(arguments[0])");
    }
    
    @Override
    public boolean isReadOnly(){
    	return (boolean) runScript(".isReadOnly()");
    }
    
	@Override
	public boolean isEditable() {
		return (boolean) runScript(".isEditable()");
	}
    
}
