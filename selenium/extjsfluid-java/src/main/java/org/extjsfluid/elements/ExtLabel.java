package org.extjsfluid.elements;

import org.extjsfluid.elements.impl.ExtLabelImpl;
import org.extjsfluid.elements.impl.internal.ImplementedBy;

/**
 * @author Gadigeppa Jattennavar
 */
@ImplementedBy(ExtLabelImpl.class)
public interface ExtLabel extends ExtElement{
	String getLabelText();
}
