package org.extjsfluid.elements;

import java.util.Date;

import org.extjsfluid.elements.impl.ExtDateFieldImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtDateFieldImpl.class)
public interface ExtDateField extends ExtPicker{

	public void selectDate(Date date);
	
	public void selectToday();
	
}
