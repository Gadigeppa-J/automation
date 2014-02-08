package org.extjsfluid.elements.impl;

import java.util.List;

import org.extjsfluid.elements.ExtGrid;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtGridImpl extends ExtTablePanelImpl implements ExtGrid{

	public ExtGridImpl(WebElement element) {
		super(element);

		// set expression
		setExpression(".getGrid(arguments[0])");
	}
		
	// Column data and row count
	private Object generateGridData(String obj){

		String expr = "ExtJsFluid.gridStorageFilled";

		// scroll to the top
		runScript(String.format(".scrollGrid(%d)", -99999)); // scroll to top

		// first clear the gridDataStorage
		runScript(".clearStorage()");

		// generateMatrix
		runScript(String.format(".generateStorage(%s)", obj));

		// wait till matrix is generated
		waitForEvalTrue(expr, 20);
		
		// return the response
		return runScript(".getStorage()");
	}
	
	@SuppressWarnings("unchecked")
	public List<String> getColumnData(String columnName){
		
		String callback = "getColumnElements";
		String obj = String.format("{callback: '%s', type: 'text', colName: '%s'}", callback, columnName);
			
		return (List<String>) generateGridData(obj);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<String> getColumnData(int columnIndex) {
		String callback = "getColumnElements";
		String obj = String.format("{callback: '%s', type: 'text', colIndex: %d}", callback, columnIndex);
				
		return (List<String>) generateGridData(obj);
	}
	
	@Override
	public Integer getRowCount() {
		String callback = "getRowCount";		
		String obj = String.format("{callback: '%s', type: 'text'}", callback);

		Object response = generateGridData(obj);
		
		return convertResponseToInteger(response);
	}	

	@Override
	public WebElement getCellElement(int rowIndex, int colIndex) {
		String callback = "getCellElement";		
		String obj = String.format("{callback: '%s', type: 'element', rowIndex: %d, colIndex: %d}", callback, rowIndex, colIndex);
		
		return (WebElement) generateGridData(obj);
	}
	
	@Override
	public String getCellData(int rowIndex, int colIndex) {
		String callback = "getCellElement";		
		String obj = String.format("{callback: '%s', type: 'text', rowIndex: %d, colIndex: %d}", callback, rowIndex, colIndex);
		
		return (String) generateGridData(obj);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<WebElement> getImageElementsFromCell(int rowIndex, int colIndex) {
		String callback = "getImageElementsFromCell";		
		String obj = String.format("{callback: '%s', type: 'element', rowIndex: %d, colIndex: %d}", callback, rowIndex, colIndex);
		
		return (List<WebElement>) generateGridData(obj);
	}

	@Override
	public WebElement getImageElementFromCellByClass(int rowIndex, int colIndex, String className) {
		String callback = "getImageElementFromCellByClass";		
		String obj = String.format("{callback: '%s', type: 'element', rowIndex: %d, colIndex: %d, className: '%s'}", callback, rowIndex, colIndex, className);
		
		return (WebElement) generateGridData(obj);
	}

	@Override
	public WebElement getLinkElementFromCellByName(int rowIndex, int colIndex, String linkName) {
		String callback = "getLinkElementFromCellByName";		
		String obj = String.format("{callback: '%s', type: 'element', rowIndex: %d, colIndex: %d, linkName: '%s'}", 
				callback, 
				rowIndex, 
				colIndex, 
				linkName);
		
		return (WebElement) generateGridData(obj);
	}

	
	// grouped	
	public Integer getGroupedHeaderIndex(String groupName, Boolean exactMatch) {
		
		String callback = "getGroupHeaderIndex";		
		String obj = String.format("{callback: '%s', type: 'element', groupName: '%s', exactMatch: %s}", callback, groupName, exactMatch);
		
		Object response = generateGridData(obj);
				
		return convertResponseToInteger(response);
	}
	
	public WebElement getGroupHeaderElementByName(String groupName, Boolean exactMatch) {
		
		String callback = "getGroupHeaderElementByName";		
		String obj = String.format("{callback: '%s', type: 'element', groupName: '%s', exactMatch: %s, readFullGroup: false}", 
				callback, 
				groupName, 
				exactMatch);
		
		return (WebElement) generateGridData(obj);
	}
	
	public Boolean isGroupCollapsed(String groupName, Boolean exactMatch) {
		String callback = "isGroupCollapsed";		
		String obj = String.format("{callback: '%s', type: 'element', groupName: '%s', exactMatch: %s, readFullGroup: false}", 
				callback, 
				groupName, 
				exactMatch);
		
		return (Boolean) generateGridData(obj);
	}

	public void toggleGroup(String groupName, Boolean exactMatch) {
		
		WebElement groupEl = this.getGroupHeaderElementByName(groupName, exactMatch);
		groupEl.click();
		
	}
	
	public void expandGroup(String groupName, Boolean exactMatch) {
		if(this.isGroupCollapsed(groupName, exactMatch)){
			this.toggleGroup(groupName, exactMatch);
		}
	}
	
	public void collapseGroup(String groupName, Boolean exactMatch) {
		
		if(!this.isGroupCollapsed(groupName, exactMatch)){
			this.toggleGroup(groupName, exactMatch);
		}
		
	}
	
	@SuppressWarnings("unchecked")
	public List<String> getColumnData(String columnName, String groupName, Boolean exactMatch){
		
		String callback = "getColumnElements";
		String obj = String.format("{callback: '%s', type: 'text', colName: '%s', groupName: '%s', exactMatch: %s}", 
				callback, 
				columnName, 
				groupName, 
				exactMatch);
			
		return (List<String>) generateGridData(obj);
	}
	
	@SuppressWarnings("unchecked")
	public List<String> getColumnData(int columnIndex, String groupName, Boolean exactMatch){
		
		String callback = "getColumnElements";
		String obj = String.format("{callback: '%s', type: 'text', colIndex: %d, groupName: '%s', exactMatch: %s}", 
				callback, 
				columnIndex, 
				groupName, 
				exactMatch);
			
		return (List<String>) generateGridData(obj);
	}
	
	public Integer getRowCount(String groupName, Boolean exactMatch) {
		String callback = "getRowCount";		
		String obj = String.format("{callback: '%s', type: 'text', groupName: '%s', exactMatch: %s}", 
				callback, 
				groupName, 
				exactMatch);

		Object response = generateGridData(obj);
		return convertResponseToInteger(response);
	}	
	
	public WebElement getCellElement(int rowIndex, int colIndex, String groupName, Boolean exactMatch) {
		String callback = "getCellElement";		
		String obj = String.format("{callback: '%s', type: 'element', rowIndex: %d, colIndex: %d, groupName: '%s', exactMatch: %s}", 
				callback, 
				rowIndex, 
				colIndex,
				groupName,
				exactMatch);
		
		return (WebElement) generateGridData(obj);
	}
	
	public String getCellData(int rowIndex, int colIndex, String groupName, Boolean exactMatch) {
		String callback = "getCellElement";		
		String obj = String.format("{callback: '%s', type: 'text', rowIndex: %d, colIndex: %d, groupName: '%s', exactMatch: %s}", 
				callback, 
				rowIndex, 
				colIndex,
				groupName,
				exactMatch);
		
		return (String) generateGridData(obj);
	}
	
	@SuppressWarnings("unchecked")
	public List<WebElement> getImageElementsFromCell(int rowIndex, int colIndex, String groupName, Boolean exactMatch) {
		String callback = "getImageElementsFromCell";		
		String obj = String.format("{callback: '%s', type: 'element', rowIndex: %d, colIndex: %d, groupName: '%s', exactMatch: %s}", 
				callback, 
				rowIndex, 
				colIndex,
				groupName,
				exactMatch);
		
		return (List<WebElement>) generateGridData(obj);
	}
	
	public WebElement getImageElementFromCellByClass(int rowIndex, int colIndex, String className, String groupName, Boolean exactMatch) {
		String callback = "getImageElementFromCellByClass";		
		String obj = String.format("{callback: '%s', type: 'element', rowIndex: %d, colIndex: %d, className: '%s', groupName: '%s', exactMatch: %s}", 
				callback, 
				rowIndex, 
				colIndex, 
				className,
				groupName,
				exactMatch);
		
		return (WebElement) generateGridData(obj);
	}
	
	public WebElement getLinkElementFromCellByName(int rowIndex, int colIndex, String linkName, String groupName, Boolean exactMatch) {
		String callback = "getLinkElementFromCellByName";		
		String obj = String.format("{callback: '%s', type: 'element', rowIndex: %d, colIndex: %d, linkName: '%s', groupName: '%s', exactMatch: %s}", 
				callback, 
				rowIndex, 
				colIndex, 
				linkName,
				groupName,
				exactMatch);
		
		return (WebElement) generateGridData(obj);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<String> getGroupNames() {
		String callback = "getGroupNames";	
		Object obj = String.format("{callback: '%s', type: 'text', groupName: ''", callback);
		
		return (List<String>) obj;
	}
}
