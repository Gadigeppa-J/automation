package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.ExtButton;
import org.openqa.selenium.WebElement;



/**
 * @author Gadigeppa Jattennavar
 */
public class ExtButtonImpl extends ExtElementImpl implements ExtButton{

	public ExtButtonImpl(WebElement element) {
		super(element);
		
		// set expression
		setExpression(".getButton(arguments[0])");
	}
	
	public String getLabel(){
		return (String) runScript(".getLabel();");
	}
	
	@Override
	public void click(){
		getWrappedElement().click();
	}
}
