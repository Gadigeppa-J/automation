package org.extjsfluid.elements;

import java.util.List;

import org.extjsfluid.elements.impl.ExtSelectImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtSelectImpl.class)
public interface ExtSelect extends ExtPicker{
	
	List<String> getOptions();
	
	List<String> getDisplayingOptions();
	
	void selectByValue(String value);
	
	void selectByIndex(int index);
	
	boolean isOptionExists(String value);
	
}
