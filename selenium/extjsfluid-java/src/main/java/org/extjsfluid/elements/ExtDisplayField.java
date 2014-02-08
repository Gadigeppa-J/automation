package org.extjsfluid.elements;

import org.extjsfluid.elements.impl.ExtDisplayFieldImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtDisplayFieldImpl.class)
public interface ExtDisplayField extends ExtForm{

	String getDisplayText();
	
	Element getDisplayElement();
}
