package org.extjsfluid.elements;

import java.util.List;

import org.extjsfluid.elements.impl.ExtGridImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtGridImpl.class)
public interface ExtGrid extends ExtTablePanel{

	Integer getRowCount();
	
	String getCellData(int rowIndex, int colIndex);
	
	List<String> getColumnData(int columnIndex);
	
	List<String> getColumnData(String columnName);
	
	WebElement getCellElement(int rowIndex, int colIndex);
	
	boolean hasAttribute(String attribute);
	
	List<WebElement> getImageElementsFromCell(int rowIndex, int colIndex);
	
	WebElement getImageElementFromCellByClass(int rowIndex, int colIndex, String className);
	
	WebElement getLinkElementFromCellByName(int rowIndex, int colIndex, String linkName);	

	// group
	
	List<String> getGroupNames();
	
	Integer getGroupedHeaderIndex(String groupName, Boolean exactMatch);
	
	WebElement getGroupHeaderElementByName(String groupName, Boolean exactMatch);
	
	Boolean isGroupCollapsed(String groupName, Boolean exactMatch);
	
	void toggleGroup(String groupName, Boolean exactMatch);
	
	void expandGroup(String groupName, Boolean exactMatch);
	
	void collapseGroup(String groupName, Boolean exactMatch);
	
	List<String> getColumnData(String columnName, String groupName, Boolean exactMatch);
	
	List<String> getColumnData(int columnIndex, String groupName, Boolean exactMatch);
	
	Integer getRowCount(String groupName, Boolean exactMatch);
	
	WebElement getCellElement(int rowIndex, int colIndex, String groupName, Boolean exactMatch);
	
	String getCellData(int rowIndex, int colIndex, String groupName, Boolean exactMatch);
	
	List<WebElement> getImageElementsFromCell(int rowIndex, int colIndex, String groupName, Boolean exactMatch);
	
	WebElement getImageElementFromCellByClass(int rowIndex, int colIndex, String className, String groupName, Boolean exactMatch);
	
	WebElement getLinkElementFromCellByName(int rowIndex, int colIndex, String linkName, String groupName, Boolean exactMatch);
	
	
}
