package org.extjsfluid.elements;


import org.extjsfluid.elements.impl.ExtTextFieldImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtTextFieldImpl.class)
public interface ExtTextField extends ExtForm{

	String getValue();
	
	String getErrorString();
	
	String getErrorString(String msgTarget);
	
	String getPlaceHolder();
	
	void set(String text);
	
	void enter(String text);
}
