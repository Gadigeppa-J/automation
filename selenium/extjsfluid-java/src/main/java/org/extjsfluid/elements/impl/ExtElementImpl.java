package org.extjsfluid.elements.impl;

import java.util.List;

import org.extjsfluid.elements.ExtElement;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

/**
 * @author Gadigeppa Jattennavar
 */

public class ExtElementImpl extends ElementImpl implements ExtElement {

	//private final WebElement element;
	private JavascriptExecutor js;
	protected String expresssion;
	
    public ExtElementImpl(WebElement element) {
        super(element);
        
        // set the expression
        setExpression(".getElement(arguments[0])");
    }	
	
	protected JavascriptExecutor getJavascriptInstance(){
		if(js == null){
			js = (JavascriptExecutor) getElementDriver();
		}
		return js;
	}
	
	protected String getExpression(){
		return expresssion;
	}
	
	protected void setExpression(String expresssion){
		this.expresssion = "return ExtJsFluid" + expresssion;
	}
	
	protected Object runScript(String scriptFunction){
		
		// Before doing anything first check if custom script is loaded
		waitForCustomScriptToLoad();
		
		// wait for any Ajax requests to finish
		waitForFinishAjaxRequest();
		
		// wait for mask to disappear if exists
		waitForMaskToDisappear();
		
		String script = getExpression() + scriptFunction;
		
		Object response = getJavascriptInstance().executeScript(script, getWrappedElement());
		return response;

	}
	
	protected boolean waitForFinishAjaxRequest() {
		  
	  final int TIME_OUT = 10; // wait for max 10 seconds
	  String expr = "ExtJsFluid.isAjaxLoading() === false";
	  
	  return waitForEvalTrue(expr, TIME_OUT);

	}
	
	protected boolean waitForCustomScriptToLoad(){
		
		  final int TIME_OUT = 10; // wait for max 10 seconds
		  String expr = "typeof ExtJsFluid !== 'undefined'";
		  
		  return waitForEvalTrue(expr, TIME_OUT);
	}
	
	protected void waitForMaskToDisappear() {
		final int TIME_OUT = 30; // wait for max 30 seconds
		String expr = "ExtJsFluid.isMaskMessageExists() === false";
		
		boolean isMaskDisappeared  = waitForEvalTrue(expr, TIME_OUT);
		
		if(!isMaskDisappeared){
			throw new RuntimeException("loading mask didn't close in expected time. Wait time: " + TIME_OUT + "seconds");
		}
		
		//return waitForEvalTrue(expr, TIME_OUT);
	}
	
	protected boolean waitForEvalTrue(String expr, int timeOut){
		
		boolean status = false;
		JavascriptExecutor js = getJavascriptInstance();
		String fullExpr = String.format("return (%s);", expr);
		
		  try{
			  
			  for (int i = 0 ; i < (timeOut*4); i++){
				  status = (boolean) js.executeScript(fullExpr);

				  if(status){
					  return true;
				  }
				  
				  Thread.sleep(250);
			  }
			  
			  return false;
			  
		  }catch(Exception e){
			  throw new RuntimeException(e.getMessage());
		  }
	}
	
	protected Integer convertResponseToInteger(Object value){
		Integer intVal;
		
		if(value instanceof Long){
			intVal = ((Number)value).intValue();
		}else{
			intVal = (int) value;
		}
		return intVal;
	}
	
	@Override
	public void click(){
		
		waitForFinishAjaxRequest();
		waitForMaskToDisappear();
		
		getWrappedElement().click();
		
	}

	@Override
	public String getText(){
		return (String) runScript(".getText();");
	}
	
	@Override
	public boolean isEnabled(){
		return (boolean) runScript(".isEnabled();");
	}
	
	@Override
	public void jsClick(){
		runScript(".click()");
	}
	
	@Override
	public void jsMouseover(boolean enabledRelatedTarget){
		runScript(String.format(".mouseover(%b)", enabledRelatedTarget));
	}
	
	@Override
	public void jsMouseout(boolean enabledRelatedTarget){
		runScript(String.format(".mouseout(%b)", enabledRelatedTarget));
	}
	
	@Override
	public void jsFocus(){
		runScript(".focus()");
	}
	
	@Override
	public void jsBlur(){
		runScript(".blur()");
	}
		
	@Override
	public boolean isDisplayed(){
		return (boolean) runScript(".isVisible()");
	}

	@Override
	public String getClassName() {
		return (String) runScript(".getClassName()");
	}

	@Override
	public String hasClass() {
		return (String) runScript(".hasClass()");
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WebElement> getChildElementsByClassName(String className) {
		return (List<WebElement>) runScript(String.format(".getChildElementsByClassName('%s')", className));
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WebElement> getVisibleChildElementsByClassName(String className) {
		return (List<WebElement>) runScript(String.format(".getVisibleChildElementsByClassName('%s')",className));
	}

	@Override
	public boolean isVisible() {
		return (boolean) runScript(".isVisible()");
	}

	@Override
	public String getDataQtip() {
		return (String) runScript(".getDataQtip()");
	}
	
	
	
}
