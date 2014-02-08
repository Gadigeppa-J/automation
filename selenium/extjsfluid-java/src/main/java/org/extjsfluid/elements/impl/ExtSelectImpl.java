package org.extjsfluid.elements.impl;

import java.util.List;

import org.extjsfluid.elements.ExtSelect;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtSelectImpl extends ExtPickerImpl implements ExtSelect{
	
    public ExtSelectImpl(WebElement element) {
        super(element);
        
		// set expression
		setExpression(".getComboBox(arguments[0])");
    }

    @Override
	@SuppressWarnings("unchecked")
	public List<String> getOptions() {
		return (List<String>) runScript(".getOptions()");
	}

    @Override
	@SuppressWarnings("unchecked")
	public List<String> getDisplayingOptions() {
		return (List<String>) runScript(".getDisplayingOptions()");
	}

    @Override
	public void selectByValue(String value) {
    	/*
    	 * Don't use '%s' as a argument, instead use \"%s\"
    	 * If any option contains ' char then '%s' will fail
    	 * e.g. option like "Adam's Car"
    	 */
		runScript(String.format(".selectOption(\"%s\")", value));
	}

    @Override
	public void selectByIndex(int index) {
		runScript(String.format(".selectOption(%d)", index));
	}

    @Override
	public boolean isOptionExists(String value) {
		return (boolean) runScript(String.format(".isOptionExists('%s')", value));
	}

}
