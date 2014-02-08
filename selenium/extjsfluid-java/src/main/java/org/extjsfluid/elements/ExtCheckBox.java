package org.extjsfluid.elements;


import org.extjsfluid.elements.impl.ExtCheckBoxImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;


/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtCheckBoxImpl.class)
public interface ExtCheckBox extends ExtForm{

	String getBoxLabel();
	
	boolean isChecked();
	
	void toggle();
	
	void check();
	
	void unCheck();
	
}
