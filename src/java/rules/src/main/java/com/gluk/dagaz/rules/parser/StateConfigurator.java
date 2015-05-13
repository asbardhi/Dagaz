package com.gluk.dagaz.rules.parser;

import org.w3c.dom.Node;
import org.w3c.dom.traversal.NodeIterator;

import com.gluk.dagaz.api.exceptions.CommonException;
import com.gluk.dagaz.api.exceptions.ParsingException;
import com.gluk.dagaz.api.state.IPiece;
import com.gluk.dagaz.api.state.IPosition;
import com.gluk.dagaz.api.state.IState;
import com.gluk.dagaz.api.state.ISession;

public class StateConfigurator extends BaseConfigurator {
	
	private final static String SETUP_XP  = "n[@t=\'setup\']/n";
	
	public void initSession(ISession sm, Node game) throws CommonException {
		IState state = sm.getInitialState();
		try {
			NodeIterator nl = getIterator(game, SETUP_XP);
			Node n;
	        if ((n = nl.nextNode())!= null) {
	        	String player = getName(n);
	        	NodeIterator pl = getIterator(n);
				Node p;
		        while ((p = pl.nextNode())!= null) {
		        	String type = getName(p);
		        	NodeIterator sl = getIterator(p);
		        	Node s;
			        while ((s = sl.nextNode())!= null) {
			        	String position = getName(s);
			        	IPosition pos = state.getPosition(position);
			        	IPiece piece = pos.addPiece(player, type);
			        	NodeIterator vl = getIterator(s);
			        	Node v;
				        while ((v = vl.nextNode())!= null) {
				        	String name = getName(v);
				        	String value = getValue(v);
				        	piece.setValue(name, value);
				        }
			        }
		        }
	        }
		} catch (Exception e) {
			throw new ParsingException(e.toString(), e);
		}
	}
}
