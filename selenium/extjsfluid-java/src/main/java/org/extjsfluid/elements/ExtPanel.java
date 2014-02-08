package org.extjsfluid.elements;

import org.extjsfluid.elements.impl.ExtPanelImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtPanelImpl.class)
public interface ExtPanel extends ExtElement{
	
	String getTitle();
	
	boolean isHelpImageExists();
	
	void clickHelp();
	
	String getBodyText();
	
}
