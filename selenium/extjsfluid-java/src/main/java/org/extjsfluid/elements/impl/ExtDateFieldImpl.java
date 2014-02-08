package org.extjsfluid.elements.impl;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.extjsfluid.elements.ExtDateField;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtDateFieldImpl extends ExtPickerImpl implements ExtDateField{

    public ExtDateFieldImpl(WebElement element) {
        super(element);
        
		// set expression
		setExpression(".getDateField(arguments[0])");
    }

	@Override
	public void selectDate(Date date) {
		
		SimpleDateFormat dateFormat = new SimpleDateFormat();
		
		// Day
		dateFormat.applyPattern("d"); // remove leading 0 in day 
		String day = dateFormat.format(date);
		
		// Month
		dateFormat.applyPattern("MMMM");
		String month = dateFormat.format(date);
		
		// Year
		dateFormat.applyPattern("yyyy");
		String year = dateFormat.format(date);
		
		//System.out.println(String.format(".selectDate('%s', '%s', '%s')", day, month, year));
		
		runScript(String.format(".selectDate('%s', '%s', '%s')", day, month, year));
		
	}

	@Override
	public void selectToday() {
		runScript(".selectToday()");
	}

}
