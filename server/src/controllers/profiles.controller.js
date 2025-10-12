// server/src/controllers/profiles.controller.js
import * as svc from '../services/profiles.service.js';

export const list = async (req, res, next) => {
  try {
    const query = req.validatedQuery || req.query || {};
    const data = await svc.list(query);
    res.json(data);
  } catch (e) { next(e); }
};

export const getById = async (req,res,next)=>{ try{
  const p = await svc.getById(req.params.id); if(!p) return res.status(404).json({error:'Profile not found'}); res.json(p);
}catch(e){ next(e); } };

export const create = async (req,res,next)=>{ try{ res.status(201).json(await svc.create(req.body)); }catch(e){ next(e); } };

export const update = async (req,res,next)=>{ try{
  const u = await svc.update(req.params.id, req.body); if(!u) return res.status(404).json({error:'Profile not found'}); res.json(u);
}catch(e){ next(e); } };

export const remove = async (req,res,next)=>{ try{
  const ok = await svc.remove(req.params.id); if(!ok) return res.status(404).json({error:'Profile not found'}); res.status(204).send();
}catch(e){ next(e); } };

