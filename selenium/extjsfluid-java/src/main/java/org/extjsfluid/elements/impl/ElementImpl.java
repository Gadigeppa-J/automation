package org.extjsfluid.elements.impl;

import java.util.Arrays;
import java.util.List;

import org.extjsfluid.elements.Element;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.internal.Coordinates;
import org.openqa.selenium.internal.Locatable;
import org.openqa.selenium.internal.WrapsDriver;

/**
 * @author Gadigeppa Jattennavar
 */
/**
 * An implementation of the Element interface. Delegates its work to an underlying WebElement instance for
 * custom functionality.
 */

public class ElementImpl implements Element {

	private final WebElement element;

	/**
	 * Creates a Element for a given WebElement.
	 *
	 * @param element element to wrap up
	 */
	public ElementImpl(final WebElement element) {
		this.element = element;
	}

	//@Override
	public void click() {
		element.click();
	}

	// @Override
	public void sendKeys(CharSequence... keysToSend) {
		element.sendKeys(keysToSend);
	}

	//@Override
	public Point getLocation() {
		return element.getLocation();
	}

	//@Override
	public void submit() {
		element.submit();
	}

	//@Override
	public String getAttribute(String name) {
		return element.getAttribute(name);
	}

	//@Override
	public String getCssValue(String propertyName) {
		return element.getCssValue(propertyName);
	}

	//@Override
	public Dimension getSize() {
		return element.getSize();
	}

	//@Override
	public List<WebElement> findElements(By by) {
		return element.findElements(by);
	}

	//@Override
	public String getText() {
		return element.getText();
	}

	//@Override
	public String getTagName() {
		return element.getTagName();
	}

	//@Override
	public boolean isSelected() {
		return element.isSelected();
	}

	//@Override
	public WebElement findElement(By by) {
		return element.findElement(by);
	}

	//@Override
	public boolean isEnabled() {
		return element.isEnabled();
	}

	//@Override
	public boolean isDisplayed() {		
		return element.isDisplayed();
	}

	//@Override
	public void clear() {
		throw new NoSuchMethodError("Method clear is not available at element level.");
	}

	//@Override
	public WebElement getWrappedElement() {
		return element;
	}

	//@Override
	@SuppressWarnings("deprecation")
	public Point getLocationOnScreenOnceScrolledIntoView() {
		return ((ElementImpl) element).getLocationOnScreenOnceScrolledIntoView();
	}

	//@Override
	public Coordinates getCoordinates() {
		return ((Locatable) element).getCoordinates();
	}

	//@Override
	public boolean elementWired() {
		return (element != null);
	}

	/*
	public void jsClick() {
	}

	public void jsMouseOver(){
	}	
	*/
	
	public WebDriver getElementDriver(){
		WrapsDriver wrapsDriver = (WrapsDriver) element;
		return wrapsDriver.getWrappedDriver();
	}

	protected String getID(){
		return element.getAttribute("id");
	}

	@Override
	public String getValue() {
		return element.getAttribute("value");
	}

	public boolean hasClass(String className){
		return Arrays.asList(getWrappedElement().getAttribute("class").split(" ")).contains(className);
	}
	
	public boolean hasAttribute(String attribute){
		String jsScript = "return document.getElementById(arguments[0]).hasAttribute(arguments[1]);";
		JavascriptExecutor js = (JavascriptExecutor) getElementDriver();
		Object response = js.executeScript(jsScript, getID(), attribute);
		return (boolean) response;
	}
	
    public boolean isEditable(){
    	if (!hasAttribute("readonly")){
    		return true;
    	}
    	return false;
    }

}


