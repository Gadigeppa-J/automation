package org.extjsfluid.elements;


import org.extjsfluid.elements.impl.ExtWindowImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;


/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtWindowImpl.class)
public interface ExtWindow extends ExtPanel{
	
	String getTitle();
	
	void close();
	
}
