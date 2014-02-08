package org.extjsfluid.elements.impl;

import java.util.List;

import org.extjsfluid.elements.ExtTablePanel;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtTablePanelImpl extends ExtPanelImpl implements ExtTablePanel{

	public ExtTablePanelImpl(WebElement element) {
		super(element);

		// set expression
		setExpression(".getTablePanel(arguments[0])");
	}
	
	// column related
	@SuppressWarnings("unchecked")
	@Override
	public List<String> getColumnNames() {
		return (List<String>) runScript(".getColumnNames()");
	}

	@Override
	public int getColumnCount() {
		int columnCount = 0;
		
		Object response = runScript(".getColumnCount()");
		
		if(response instanceof Long){
			columnCount = ((Number)response).intValue();
		}else{
			columnCount = (int) response;
		}
		
		return columnCount;
	}
	
	@Override
	public int getColumnIndex(String columnName) {
		int colIndex = 0;
		
		Object response = runScript(String.format(".getColumnIndex('%s')", columnName));
		
		if(response instanceof Long){
			colIndex = ((Number)response).intValue();
		}else{
			colIndex = (int) response;
		}
		
		return colIndex;
	}

	@Override
	public boolean isColumnExists(String columnName) {
		return (boolean) runScript(String.format(".isColumnExists('%s')", columnName));
	}

	@Override
	public void clickColumn(String columnName) {
		WebElement element = (WebElement)runScript(String.format(".getColHeaderElementByName('%s')", columnName));
		
		/*
		 * Muthu:
		 * Direct click on column header is not working in firefox,
		 * so we are getting the header text span and clicking on it.
		 */
		
		element.findElement(By.className("x-column-header-text")).click();
	}

	@Override
	public boolean isColumnSortable(String columnName) {
		return (boolean) runScript(String.format(".isColHeaderSortable('%s')", columnName));
	}

	@Override
	public String getColumnSortState(String columnName) {
		String sortState = (String) runScript(String.format(".getColHeaderSortState('%s')", columnName));
		
		if(sortState == null){
			sortState = "MIXED"; // means not sorted
		}
		
		
		// final sortState will be either
		// ASC (Ascending)
		// DESC (Descending)
		// MIXED (not sorted)
		
		return sortState;
	}

	
}
