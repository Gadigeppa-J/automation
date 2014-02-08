package org.extjsfluid.elements;


import org.extjsfluid.elements.impl.ExtButtonImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtButtonImpl.class)
public interface ExtButton extends ExtElement{	
	String getLabel();
}
