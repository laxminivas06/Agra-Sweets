import React, { useEffect, useState } from 'react';
import { getSweets, saveSweets } from '../../services/dataService';
import { Plus, Edit2, Trash2, Download, Printer, Image as ImageIcon, Video, X, Save, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ManageSweets = () => {
  const [sweets, setSweets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSweet, setCurrentSweet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    setLoading(true);
    const data = await getSweets();
    setSweets(data);
    setLoading(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = currentSweet?.id || Date.now();

    const nameStr = formData.get('name');
    let qrStr = currentSweet?.qr;
    if (!qrStr) {
      qrStr = nameStr.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    }

    const newSweet = {
      id,
      name: nameStr,
      image: formData.get('image'),
      price250: Number(formData.get('price250')),
      price500: Number(formData.get('price500')),
      price1000: Number(formData.get('price1000')),
      manufacture: formData.get('manufacture'),
      expiry: formData.get('expiry'),
      description: formData.get('description'),
      video: formData.get('video'),
      qr: qrStr
    };

    let updatedList;
    if (currentSweet?.id) {
      updatedList = sweets.map(s => s.id === id ? newSweet : s);
    } else {
      updatedList = [...sweets, newSweet];
    }

    setSweets(updatedList);
    saveSweets(updatedList);
    setIsEditing(false);
    setCurrentSweet(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      const updatedList = sweets.filter(s => s.id !== id);
      setSweets(updatedList);
      saveSweets(updatedList);
    }
  };

  const downloadQR = (sweet) => {
    const svg = document.getElementById(`qr-svg-${sweet.id}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      const canvasObj = document.createElement("canvas");
      const padding = 20;
      const textHeight = 40;

      canvasObj.width = img.width + (padding * 2);
      canvasObj.height = img.height + (padding * 2) + textHeight;

      const ctx = canvasObj.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasObj.width, canvasObj.height);

      ctx.strokeStyle = "#B85C1A";
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, canvasObj.width - 4, canvasObj.height - 4);

      ctx.drawImage(img, padding, padding);

      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(sweet.name, canvasObj.width / 2, canvasObj.height - 20);

      const pngFile = canvasObj.toDataURL("image/png");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `QR_${sweet.name.replace(/\s+/g, '_')}.png`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const printQR = (sweet) => {
    const svg = document.getElementById(`qr-svg-${sweet.id}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write('<html><head><title>Print QR</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
    printWindow.document.write('</head><body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; text-align:center;">');
    printWindow.document.write(`<div style="padding: 2rem; border: 4px solid #B85C1A; border-radius: 1rem; display: inline-block;">`);
    printWindow.document.write(svg.outerHTML);
    printWindow.document.write(`<h2 style="font-family:sans-serif; margin-top: 1.5rem; color: #1f2937;">${sweet.name}</h2>`);
    printWindow.document.write(`</div></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };

  if (isEditing) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          padding: 'clamp(24px, 5vw, 40px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: '800', color: '#2D2D2D', margin: 0 }}>
              {currentSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
            <button onClick={() => setIsEditing(false)} style={{ padding: '8px', cursor: 'pointer', background: 'none', border: 'none', color: '#7A7A7A' }}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>Menu Item Name *</label>
                <input type="text" name="name" defaultValue={currentSweet?.name} required style={{ width: '100%', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px', fontSize: '16px' }} />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>
                  <ImageIcon size={16} /> Image URL
                </label>
                <input type="url" name="image" defaultValue={currentSweet?.image} placeholder="https://..." style={{ width: '100%', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px' }} />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>
                  <Video size={16} /> Video URL
                </label>
                <input type="url" name="video" defaultValue={currentSweet?.video} placeholder="YouTube or MP4 link" style={{ width: '100%', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>Price 250g (₹) *</label>
                <input type="number" name="price250" defaultValue={currentSweet?.price250} required style={{ width: '100%', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>Price 500g (₹) *</label>
                <input type="number" name="price500" defaultValue={currentSweet?.price500} required style={{ width: '100%', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>Price 1Kg (₹) *</label>
                <input type="number" name="price1000" defaultValue={currentSweet?.price1000} required style={{ width: '100%', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>Manufacture Date *</label>
                <input type="date" name="manufacture" defaultValue={currentSweet?.manufacture} required style={{ width: '100%', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>Expiry Date *</label>
                <input type="date" name="expiry" defaultValue={currentSweet?.expiry} required style={{ width: '100%', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4A4A4A' }}>Description *</label>
                <textarea name="description" rows="4" defaultValue={currentSweet?.description} required style={{ width: '100%', padding: '12px', border: '2px solid #E5E5E5', borderRadius: '12px' }}></textarea>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #F0E0D0' }}>
              <button type="submit" style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #B85C1A 0%, #E87A2A 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={18} /> Save & Publish
              </button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '14px 28px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: '800', color: '#2D2D2D', marginBottom: '8px' }}>Manage Sweets</h1>
          <p style={{ color: '#7A7A7A' }}>Add, edit, or remove sweets and manage QR codes</p>
        </div>
        <button onClick={() => setIsEditing(true)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #B85C1A 0%, #E87A2A 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Sweet
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#7A7A7A' }}>Loading sweets...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {sweets.map(sweet => (
            <div key={sweet.id} style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
              <div style={{ display: 'flex', padding: '20px', gap: '16px' }}>
                {/* Image Preview */}
                <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'linear-gradient(135deg, #FFF8F0 0%, #FFEFE0 100%)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {sweet.image ?
                    <img src={sweet.image} alt={sweet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                    <span style={{ fontSize: '2.5rem' }}>🍬</span>
                  }
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#2D2D2D', marginBottom: '4px' }}>{sweet.name}</h3>
                  <p style={{ fontSize: '14px', color: '#B85C1A', fontWeight: '700', marginBottom: '12px' }}>₹{sweet.price1000}/kg</p>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setCurrentSweet(sweet); setIsEditing(true); }} style={{ padding: '6px 12px', background: '#f5f5f5', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(sweet.id)} style={{ padding: '6px 12px', background: '#FEE2E2', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingLeft: '16px', borderLeft: '1px solid #F0E0D0' }}>
                  <div style={{ padding: '8px', background: '#fff', border: '2px solid #F0E0D0', borderRadius: '12px' }}>
                    <QRCodeSVG id={`qr-svg-${sweet.id}`} value={`${window.location.origin}/sweet/${sweet.qr}`} size={70} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => downloadQR(sweet)} title="Download QR" style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#B85C1A' }}>
                      <Download size={18} />
                    </button>
                    <button onClick={() => printQR(sweet)} title="Print QR" style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                      <Printer size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sweets.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px', color: '#7A7A7A', border: '2px dashed #F0E0D0' }}>
              <AlertCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No sweets registered yet. Click "Add Sweet" to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageSweets;