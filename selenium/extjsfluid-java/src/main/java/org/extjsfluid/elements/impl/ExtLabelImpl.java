package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.ExtLabel;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtLabelImpl extends ExtElementImpl implements ExtLabel{

    public ExtLabelImpl(WebElement element) {
        super(element);
        
		// set expression
		setExpression(".getLabel(arguments[0])");
    }

	@Override
	public String getLabelText() {
		return (String) runScript(".getText()");
	}
    
}
