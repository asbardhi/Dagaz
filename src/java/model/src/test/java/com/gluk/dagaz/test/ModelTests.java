package com.gluk.dagaz.test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import com.gluk.dagaz.api.model.IBoard;
import com.gluk.dagaz.api.model.IPlayers;
import com.gluk.dagaz.api.state.IEnvironment;
import com.gluk.dagaz.exceptions.CommonException;
import com.gluk.dagaz.model.Board;
import com.gluk.dagaz.model.Grid;
import com.gluk.dagaz.model.Players;
import com.gluk.dagaz.state.GlobalEnvironment;
import com.gluk.dagaz.state.PlayersEnvironment;

public class ModelTests {
	
	@Test
	public void testPlayers() throws CommonException {
		IPlayers p = new Players();
		p.addPlayer("White");
		p.addPlayer("Black");
		assertTrue(p.isDefined("White"));
		assertFalse(p.isDefined("Green"));
		assertTrue(p.getTurn(1) == 1);
		assertTrue(p.getTurn(2) == 1);
		assertTrue(p.getTurn(3) == 2);
		assertTrue(p.getTurn(4) == 2);
		assertTrue(p.getOrder(1) == 1);
		assertTrue(p.getOrder(2) == 2);
		assertTrue(p.getOrder(3) == 1);
		assertTrue(p.getOrder(4) == 2);
		assertTrue(p.getPlayer(1).equals("White"));
		assertTrue(p.getPlayer(2).equals("Black"));
		assertTrue(p.getPlayer(3).equals("White"));
		assertTrue(p.getPlayer(4).equals("Black"));
	}

	@Test
	public void testSymetries() throws CommonException {
		IPlayers p = new Players();
		p.addPlayer("South");
		p.addPlayer("West");
		p.addPlayer("North");
		p.addPlayer("East");
		p.addSymmetry("West", "n", "e");
		p.addSymmetry("North", "n", "s");
		p.addSymmetry("East", "n", "w");
		p.addSymmetry("West", "s", "w");
		assertTrue(p.isDefined("n"));
		assertTrue(p.isDefined("s"));
		assertFalse(p.isDefined("e"));
		assertTrue(p.getDirection("South", "n").equals("n"));
		assertTrue(p.getDirection("North", "n").equals("s"));
		assertTrue(p.get("North", "North").getBoolean());
		assertFalse(p.get("North", "South").getBoolean());
		assertTrue(p.get("West", "n").getString().equals("e"));
		assertTrue(p.get("West", "s").getString().equals("w"));
	}

	@Test
	public void testBoardPositions() throws CommonException {
		IBoard b = new Board();
		b.addPosition("a1");
		b.addPosition("a2");
		b.addPosition("b1");
		b.addPosition("b2");
		assertTrue(b.isDefined("a1"));
		assertFalse(b.isDefined("a3"));
		b.addLink("n", "a1", "a2");
		b.addLink("n", "b1", "b2");
		b.addLink("s", "a2", "a1");
		b.addLink("s", "b2", "b1");
		b.addLink("e", "a1", "b1");
		b.addLink("e", "a2", "b2");
		b.addLink("w", "b1", "a1");
		b.addLink("w", "b2", "a2");
		assertTrue(b.isDefined("n"));
		assertTrue(b.isDefined("s"));
		assertTrue(b.isDefined("w"));
		assertTrue(b.isDefined("e"));
		assertFalse(b.isDefined("nw"));
		b.delPosition("a1");
		b.delLink("n", "b1");
		assertFalse(b.isDefined("a1"));
		assertFalse(b.isDefined("n"));
		assertTrue(b.isDefined("e"));
	}

	@Test
	public void testBoardZones() throws CommonException {
		IEnvironment ge = new GlobalEnvironment();
		Players p = new Players();
		p.addPlayer("White");
		p.addPlayer("Black");
		IEnvironment pe = new PlayersEnvironment(p, 1, ge);
		IBoard b = new Board();
		b.addPosition("a1");
		b.addPosition("a2");
		b.addPosition("b1");
		b.addPosition("b2");
		b.addZone("start", "a1");
		b.addZone("promotion", "White", "a2");
		b.addZone("promotion", "White", "b2");
		b.addZone("promotion", "Black", "a1");
		b.addZone("promotion", "Black", "b1");
		assertTrue(b.inZone("start", "a1", pe));
		assertFalse(b.inZone("start", "b2", pe));
		assertFalse(b.inZone("start", "dummy", pe));
		assertTrue(b.inZone("promotion", "a2", pe));
		assertFalse(b.inZone("promotion", "b1", pe));

		pe = new PlayersEnvironment(p, 2, ge);
		assertTrue(b.inZone("start", "a1", pe));
		assertFalse(b.inZone("start", "b2", pe));
		assertTrue(b.inZone("promotion", "a1", pe));
		assertFalse(b.inZone("promotion", "b2", pe));
	}

	@Test
	public void testBoardNavigation() throws CommonException {
		IEnvironment ge = new GlobalEnvironment();
		Players p = new Players();
		p.addPlayer("White");
		p.addPlayer("Black");
		p.addSymmetry("Black", "n", "s");
		p.addSymmetry("Black", "s", "n");
		IEnvironment pe = new PlayersEnvironment(p, 1, ge);
		IBoard b = new Board();
		b.addPosition("a1");
		b.addPosition("a2");
		b.addPosition("b1");
		b.addPosition("b2");
		b.addLink("n", "a1", "a2");
		b.addLink("n", "b1", "b2");
		b.addLink("s", "a2", "a1");
		b.addLink("s", "b2", "b1");
		b.addLink("e", "a1", "b1");
		b.addLink("e", "a2", "b2");
		b.addLink("w", "b1", "a1");
		b.addLink("w", "b2", "a2");
		assertTrue(b.navigate("n", "a1", pe).equals("a2"));
		assertTrue(b.navigate("e", "a1", pe).equals("b1"));
		assertTrue(b.navigate("s", "a1", pe).isEmpty());
		assertTrue(b.navigate("w", "a1", pe).isEmpty());

		pe = new PlayersEnvironment(p, 2, ge);
		assertTrue(b.navigate("n", "b2", pe).equals("b1"));
		assertTrue(b.navigate("w", "b2", pe).equals("a2"));
		assertTrue(b.navigate("s", "b2", pe).isEmpty());
		assertTrue(b.navigate("e", "b2", pe).isEmpty());
	}
	
	@Test
	public void testGridTiny() throws CommonException {
		IBoard b = new Board();
		Grid g = new Grid(b);
		g.addDimension("IV/III/II/I");
		g.createPositions();
		assertTrue(b.isDefined("I"));
		assertTrue(b.isDefined("II"));
		assertTrue(b.isDefined("III"));
		assertTrue(b.isDefined("IV"));
		assertFalse(b.isDefined("V"));
		
		List<Integer> deltas = new ArrayList<Integer>();
		deltas.add(2);
		g.addDirection("e", deltas);
		deltas.clear();
		deltas.add(-2);
		g.addDirection("w", deltas);
		b.addLink("e", "II", "IV");
		b.addLink("e", "I", "III");
		b.addLink("w", "IV", "II");
		b.addLink("w", "III", "I");
		
		IEnvironment ge = new GlobalEnvironment();
		Players p = new Players();
		p.addPlayer("You");
		IEnvironment pe = new PlayersEnvironment(p, 1, ge);
		assertTrue(b.navigate("e", "I", pe).equals("III"));
		assertTrue(b.navigate("e", "II", pe).equals("IV"));
		assertTrue(b.navigate("e", "III", pe).equals("I"));
		assertTrue(b.navigate("e", "IV", pe).equals("II"));
		assertTrue(b.navigate("w", "I", pe).equals("III"));
		assertTrue(b.navigate("w", "II", pe).equals("IV"));
		assertTrue(b.navigate("w", "III", pe).equals("I"));
		assertTrue(b.navigate("w", "IV", pe).equals("II"));
	}

	@Test
	public void testGridSmall() throws CommonException {
		IBoard b = new Board();
		Grid g = new Grid(b);
		g.addDimension("a/b/c");
		g.addDimension("3/2/1");
		g.createPositions();
		assertTrue(b.isDefined("a1"));
		assertTrue(b.isDefined("a2"));
		assertTrue(b.isDefined("a3"));
		assertTrue(b.isDefined("b1"));
		assertTrue(b.isDefined("b2"));
		assertTrue(b.isDefined("b3"));
		assertTrue(b.isDefined("c1"));
		assertTrue(b.isDefined("c2"));
		assertTrue(b.isDefined("c3"));
		assertFalse(b.isDefined("c4"));
		assertFalse(b.isDefined("d3"));
		
		b.delPosition("b2");
		List<Integer> deltas = new ArrayList<Integer>();
		deltas.add(0);
		deltas.add(1);
		g.addDirection("s", deltas);
		deltas.clear();
		deltas.add(0);
		deltas.add(-1);
		g.addDirection("n", deltas);
		deltas.clear();
		deltas.add(1);
		deltas.add(0);
		g.addDirection("e", deltas);
		deltas.clear();
		deltas.add(-1);
		deltas.add(0);
		g.addDirection("w", deltas);
		deltas.clear();
		deltas.add(-1);
		deltas.add(-1);
		
		IEnvironment ge = new GlobalEnvironment();
		Players p = new Players();
		p.addPlayer("White");
		p.addPlayer("Black");
		IEnvironment pe = new PlayersEnvironment(p, 1, ge);
		assertTrue(b.navigate("n", "a1", pe).equals("a2"));
		assertTrue(b.navigate("e", "a2", pe).isEmpty());
		assertTrue(b.navigate("n", "a2", pe).equals("a3"));
		assertTrue(b.navigate("e", "a3", pe).equals("b3"));
		assertTrue(b.navigate("s", "b3", pe).isEmpty());
		assertTrue(b.navigate("e", "b3", pe).equals("c3"));
		assertTrue(b.navigate("s", "c3", pe).equals("c2"));
		assertTrue(b.navigate("w", "c2", pe).isEmpty());
		assertTrue(b.navigate("s", "c2", pe).equals("c1"));
		assertTrue(b.navigate("w", "c1", pe).equals("b1"));
		assertTrue(b.navigate("n", "b1", pe).isEmpty());
		assertTrue(b.navigate("w", "b1", pe).equals("a1"));
	}

	@Test
	public void testGridLarge() throws CommonException {
		IBoard b = new Board();
		Grid g = new Grid(b);
		g.addDimension("A-H/J-T");
		g.addDimension("19-1");
		g.addDimension("x/y/z");
		g.createPositions();
		assertTrue(b.isDefined("A1x"));
		assertTrue(b.isDefined("H10y"));
		assertTrue(b.isDefined("J19z"));
		assertFalse(b.isDefined("I1x"));
	}
}
