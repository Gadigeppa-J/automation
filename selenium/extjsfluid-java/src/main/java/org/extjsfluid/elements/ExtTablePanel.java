package org.extjsfluid.elements;

import java.util.List;

import org.extjsfluid.elements.impl.ExtTablePanelImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtTablePanelImpl.class)
public interface ExtTablePanel extends ExtPanel{

	List<String> getColumnNames();
	
	int getColumnCount();
	
	int getColumnIndex(String columnName);
	
	boolean isColumnExists(String columnName);
	
	boolean isColumnSortable(String columnName);
	
	String getColumnSortState(String columnName);
	
	void clickColumn(String columnName);
	
}
