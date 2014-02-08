package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.ExtPanel;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtPanelImpl extends ExtElementImpl implements ExtPanel{

	public ExtPanelImpl(WebElement element) {
		super(element);

		// set expression
		setExpression(".getExtPanel(arguments[0])");
	}

	@Override
	public String getTitle() {
		return (String)runScript(".getTitle()");
	}

	private WebElement getHelpImageElement(){
		return (WebElement) runScript(".getHelpImageElement()");
	}
	
	@Override
	public boolean isHelpImageExists() {
		WebElement imgEl = getHelpImageElement();
		
		if(imgEl != null){
			return true;
		}
		
		return false;
	}

	@Override
	public void clickHelp() {

		if(isHelpImageExists()){
			WebElement imgEl = getHelpImageElement();
			imgEl.click();
		}else{
			throw new RuntimeException("Help image doesn't exists");
		}
		
		
	}

	@Override
	public String getBodyText() {
		return (String)runScript(".getBodyText()");
	}
}
