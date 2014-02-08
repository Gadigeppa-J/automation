package org.extjsfluid.elements;

import java.util.List;

import org.extjsfluid.elements.impl.ExtTabPanelImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtTabPanelImpl.class)
public interface ExtTabPanel extends ExtPanel{

	List<String> getTabNames();
	
	String getSelectedTabName();
	
	Boolean selectTab(String tabName);
	
	public Boolean isTabSelected(String tabName);
	
}
