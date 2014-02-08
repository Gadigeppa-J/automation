package org.extjsfluid.elements.impl;

import java.util.List;

import org.extjsfluid.elements.ExtTabPanel;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtTabPanelImpl extends ExtPanelImpl implements ExtTabPanel{

	public ExtTabPanelImpl(WebElement element) {
		super(element);

		// set expression
		setExpression(".getTabPanel(arguments[0])");
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<String> getTabNames() {
		return (List<String>) runScript(".getTabNames()");
	}

	@Override
	public String getSelectedTabName() {
		return (String) runScript(".getSelectedTabName()");
	}
	
	@Override
	public Boolean isTabSelected(String tabName) {
		return (Boolean) runScript(String.format(".isTabSelected('%s')", tabName));
	}
	
	@Override
	public Boolean selectTab(String tabName) {
		WebElement tabEl = (WebElement)runScript(String.format(".getTabElementToSelect('%s')", tabName));
		
		tabEl.click();
		
		return this.isTabSelected(tabName);
		
	}
}
