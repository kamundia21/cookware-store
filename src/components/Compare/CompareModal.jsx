import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './CompareModal.css';

export function CompareModal({ products, onClose }) {
  if (products.length === 0) return null;

  return (
    <div className="compare-modal-overlay" onClick={onClose}>
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Compare Products ({products.length})</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="compare-table">
          <div className="compare-row">
            <div className="compare-cell header">Product</div>
            {products.map(p => (
              <div key={p.id} className="compare-cell">
                <img src={p.image_url} alt={p.name} />
                <p>{p.name}</p>
              </div>
            ))}
          </div>
          
          <div className="compare-row">
            <div className="compare-cell header">Price</div>
            {products.map(p => (
              <div key={p.id} className="compare-cell price">KSH {p.price}</div>
            ))}
          </div>
          
          <div className="compare-row">
            <div className="compare-cell header">Material</div>
            {products.map(p => (
              <div key={p.id} className="compare-cell">
                {p.description?.match(/Material:\s*([^\n,]+)/i)?.[1] || 'N/A'}
              </div>
            ))}
          </div>
          
          <div className="compare-row">
            <div className="compare-cell header">Warranty</div>
            {products.map(p => (
              <div key={p.id} className="compare-cell">1 Year</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}