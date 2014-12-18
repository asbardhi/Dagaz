package com.gluk.dagaz.rules.board;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import com.gluk.dagaz.api.application.IApplication;
import com.gluk.dagaz.api.exceptions.BoardException;
import com.gluk.dagaz.api.exceptions.CommonException;
import com.gluk.dagaz.api.random.IRandomFactory;
import com.gluk.dagaz.api.random.IRandomGenerator;
import com.gluk.dagaz.api.rules.board.IBoard;
import com.gluk.dagaz.api.rules.board.IBoardOperationCallback;
import com.gluk.dagaz.api.state.IPiece;
import com.gluk.dagaz.api.state.IPosition;
import com.gluk.dagaz.api.state.IState;

public class Board extends BoardConfiguration implements IBoard {
	
	private final static String RANDOM_GENEGATOR = "_zobrist";
	
	private IApplication app;
	private Map<String, Map<String, Long>> hashValues = new HashMap<String, Map<String, Long>>();
	
	public Board(IApplication app) {
		this.app = app;
	}

	public boolean inZone(String position, String name, String player) throws BoardException {
		Map<String, Set<String>> zl = zones.get(name);
		if (zl == null) {
			throw new BoardException("Zone [" + name + "] undefined");
		}
		Set<String> pl = zl.get(player);
		if ((pl != null) && pl.contains(position)) {
			return true;
		}
		pl = zl.get("");
		return pl.contains(position);
	}

	public String changePosition(String position, String direction, String player) throws BoardException {
		Map<String, String> s = symmetries.get(direction);
		if (s != null) {
			String d = s.get(player);
			if (d != null) {
				direction = d;
			}
		}
		String np = null;
		DirectionList d = positions.get(position);
		if (d != null) {
			np = d.getPosition(direction);
		}
		Map<String, String> gl = synonyms.get(position);
		if (gl != null) {
			String op = gl.get(player);
			if (op == null) {
				op = gl.get("");
			}
			if (op != null) {
				d = positions.get(op);
				if (d != null) {
					String p = d.getPosition(direction);
					if (p != null) {
						if (np != null) {
							throw new BoardException("Duplicate direction [" + direction + "] from [" + position + "]");
						}
						np = p;
					}
				}
			}
		}
		if (np == null) {
			throw new BoardException("Direction [" + direction + "] from [" + position + "] not found");
		}
		gl = gates.get(np);
		if (gl != null) {
			String p = gl.get(player);
			if (p == null) {
				p = gl.get("");
			}
			if (p != null) {
				np = p;
			}
		}
		return np;
	}

	public void execOperation(String name, String player, IBoardOperationCallback callback) throws BoardException {
		Map<String, Map<String, String>> pl = operations.get(name);
		if (pl != null) {
			Map<String, String> o = pl.get(player);
			if (o == null) {
				o = pl.get("");
			}
			if (o != null) {
				for (String p: o.keySet()) {
					callback.changePosition(p, o.get(p));
				}
			}
		}
	}

	public void initState(IState state) throws BoardException {
		for (String name: counters.keySet()) {
			state.setValue(name, counters.get(name));
		}
	}
	
	private synchronized long getHashValue(String position, String key) {
		Map<String, Long> values = hashValues.get(position);
		if (values == null) {
			values = new HashMap<String, Long>();
			hashValues.put(position, values);
		}
		Long r = values.get(key);
		if (r == null) {
			IRandomFactory rf = app.getRandomFactory();
			IRandomGenerator gen = rf.createGenerator(RANDOM_GENEGATOR);
			r = new Long(gen.getLongValue());
			values.put(key, r);
		}
		return r;
	}

	@Override
	public long addToHash(long hash, String position, IState state) throws CommonException {
		if (state.positionExists(position)) {
			IPosition pos = state.getPosition(position);
			if (!pos.isEmpty()) {
				IPiece piece = pos.getPiece();
				String key = piece.getHashKey();
				hash ^= getHashValue(position, key);
			}
		}
		return hash;
	}
}
