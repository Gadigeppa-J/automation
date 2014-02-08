package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.ExtCheckBox;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtCheckBoxImpl extends ExtFormImpl implements ExtCheckBox{

	public ExtCheckBoxImpl(WebElement element) {
		super(element);
		
		// set expression
		setExpression(".getCheckBox(arguments[0])");
	}

	@Override
	public String getBoxLabel() {
		return (String)runScript(".getBoxLabel()");
	}

	@Override
	public boolean isChecked() {
		return (boolean)runScript(".isChecked()");
	}
	
	@Override
    public void toggle() {
		WebElement inputEl = getInputElement();
		inputEl.click();
    }

	@Override
    public void check() {		
        if (!isChecked()) {
            toggle();            
        }
        
    }

	@Override
    public void unCheck() {
        if (isChecked()) {
            toggle();           
        }
        
    }
	
	/*
	 *  // to be used later
	private String getLabelToLog(){
		String label = this.getLabelText();
		
		if(label.trim().isEmpty()){
			label = this.getBoxLabel();
		}
		
		return label;
	}
	*/
	
}
