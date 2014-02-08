package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.ExtTextArea;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtTextAreaImpl extends ExtTextFieldImpl implements ExtTextArea{

	//private static final Logger LOG = LoggerFactory.getLogger(ExtSelectImpl.class);
	
    public ExtTextAreaImpl(WebElement element) {
        super(element);
        
		// set expression
		setExpression(".getTextArea(arguments[0])");
    }
}
