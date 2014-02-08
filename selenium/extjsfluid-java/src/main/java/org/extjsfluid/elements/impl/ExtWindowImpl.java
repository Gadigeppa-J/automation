package org.extjsfluid.elements.impl;

import org.extjsfluid.elements.ExtWindow;
import org.openqa.selenium.WebElement;


/**
 * @author Gadigeppa Jattennavar
 */
public class ExtWindowImpl extends ExtPanelImpl implements ExtWindow{

	public ExtWindowImpl(WebElement element) {
		super(element);

		// set expression
		setExpression(".getExtWindow(arguments[0])");
	}

	@Override
	public String getTitle() {
		return (String)runScript(".getTitle()");
	}

	@Override
	public void close() {
		WebElement closeImg = (WebElement)runScript(".getCloseImg()");
		closeImg.click();
	}
}
