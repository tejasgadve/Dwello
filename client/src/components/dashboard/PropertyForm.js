/**
 * PropertyForm - Shared form for Add/Edit property
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  title: '', description: '', type: 'PG', price: '', deposit: '',
  genderPreference: 'Co-ed', occupancy: 'Any', furnishing: 'Furnished',
  address: { street: '', city: '', state: '', pincode: '' },
  location: { coordinates: ['', ''] }, // [lng, lat]
  nearbyColleges: [{ name: '', distance: '' }],
  amenities: { wifi: false, food: false, parking: false, ac: false, laundry: false, gym: false, security: false, powerBackup: false, tv: false, hotWater: false, housekeeping: false, cctv: false },
  images: [],
};

const AMENITY_LABELS = {
  wifi: '📶 WiFi', food: '🍽️ Food', parking: '🚗 Parking', ac: '❄️ AC',
  laundry: '👕 Laundry', gym: '💪 Gym', security: '🔒 Security',
  powerBackup: '⚡ Power Backup', tv: '📺 TV', hotWater: '🚿 Hot Water',
  housekeeping: '🧹 Housekeeping', cctv: '📷 CCTV',
};

const PropertyForm = ({ existing }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(existing ? {
    ...INITIAL_FORM, ...existing,
    address: existing.address || INITIAL_FORM.address,
    location: existing.location || INITIAL_FORM.location,
    amenities: { ...INITIAL_FORM.amenities, ...existing.amenities },
    nearbyColleges: existing.nearbyColleges?.length ? existing.nearbyColleges : INITIAL_FORM.nearbyColleges,
  } : INITIAL_FORM);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!existing;

  const set = (path, value) => {
    const keys = path.split('.');
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let images = form.images || [];

      // Upload new images if any
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((f) => formData.append('images', f));
        const { data: uploadData } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        images = [...images, ...uploadData.images];
      }

      // Build payload
      const payload = {
        ...form,
        price: Number(form.price),
        deposit: Number(form.deposit) || 0,
        images,
        nearbyColleges: form.nearbyColleges.filter((c) => c.name),
        location: {
          type: 'Point',
          coordinates: [
            parseFloat(form.location?.coordinates?.[0]) || 77.1995,
            parseFloat(form.location?.coordinates?.[1]) || 28.5494,
          ],
        },
      };

      if (isEdit) {
        await api.put(`/properties/${existing._id}`, payload);
        toast.success('Property updated!');
      } else {
        await api.post('/properties', payload);
        toast.success('Property listed successfully!');
      }

      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const addCollege = () => setForm((p) => ({ ...p, nearbyColleges: [...p.nearbyColleges, { name: '', distance: '' }] }));
  const removeCollege = (i) => setForm((p) => ({ ...p, nearbyColleges: p.nearbyColleges.filter((_, idx) => idx !== i) }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? '✏️ Edit Property' : '➕ Add New Property'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Basic Information</h3>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title *</label>
            <input type="text" required value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Sunshine PG for Boys Near IIT Delhi"
              className="input" maxLength={100} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description *</label>
            <textarea required value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Describe your property in detail..."
              rows={4} className="input resize-none" minLength={20} maxLength={2000} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Property Type *</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className="input text-sm">
                {['PG', 'Flat', 'Hostel', 'Room'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Gender Preference *</label>
              <select value={form.genderPreference} onChange={(e) => set('genderPreference', e.target.value)} className="input text-sm">
                {['Boys', 'Girls', 'Co-ed'].map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Occupancy</label>
              <select value={form.occupancy} onChange={(e) => set('occupancy', e.target.value)} className="input text-sm">
                {['Single', 'Double', 'Triple', 'Any'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Furnishing</label>
              <select value={form.furnishing} onChange={(e) => set('furnishing', e.target.value)} className="input text-sm">
                {['Furnished', 'Semi-furnished', 'Unfurnished'].map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Monthly Rent (₹) *</label>
              <input type="number" required min={500} value={form.price} onChange={(e) => set('price', e.target.value)} className="input text-sm" placeholder="8000" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Security Deposit (₹)</label>
            <input type="number" min={0} value={form.deposit} onChange={(e) => set('deposit', e.target.value)} className="input text-sm" placeholder="0" />
          </div>
        </div>

        {/* Address */}
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Address</h3>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Street Address *</label>
            <input type="text" required value={form.address.street} onChange={(e) => set('address.street', e.target.value)} className="input text-sm" placeholder="42, Hauz Khas Village" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">City *</label>
              <input type="text" required value={form.address.city} onChange={(e) => set('address.city', e.target.value)} className="input text-sm" placeholder="New Delhi" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">State *</label>
              <input type="text" required value={form.address.state} onChange={(e) => set('address.state', e.target.value)} className="input text-sm" placeholder="Delhi" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Pincode *</label>
              <input type="text" required value={form.address.pincode} onChange={(e) => set('address.pincode', e.target.value)} className="input text-sm" placeholder="110016" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Longitude (GPS)</label>
              <input type="number" step="any" value={form.location?.coordinates?.[0]} onChange={(e) => set('location.coordinates.0', e.target.value)} className="input text-sm" placeholder="77.1995" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Latitude (GPS)</label>
              <input type="number" step="any" value={form.location?.coordinates?.[1]} onChange={(e) => set('location.coordinates.1', e.target.value)} className="input text-sm" placeholder="28.5494" />
            </div>
          </div>
          <p className="text-xs text-gray-400">💡 Find coordinates at <a href="https://www.latlong.net" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">latlong.net</a></p>
        </div>

        {/* Nearby Colleges */}
        <div className="card p-6 space-y-3">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Nearby Colleges</h3>
          {form.nearbyColleges.map((c, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input type="text" value={c.name} onChange={(e) => {
                const updated = [...form.nearbyColleges];
                updated[i] = { ...updated[i], name: e.target.value };
                setForm((p) => ({ ...p, nearbyColleges: updated }));
              }} placeholder="College name" className="input text-sm flex-1" />
              <input type="number" value={c.distance} onChange={(e) => {
                const updated = [...form.nearbyColleges];
                updated[i] = { ...updated[i], distance: e.target.value };
                setForm((p) => ({ ...p, nearbyColleges: updated }));
              }} placeholder="km" className="input text-sm w-20" step="0.1" />
              {i > 0 && <button type="button" onClick={() => removeCollege(i)} className="text-red-400 hover:text-red-600 text-lg">✕</button>}
            </div>
          ))}
          <button type="button" onClick={addCollege} className="text-sm text-primary-600 hover:underline">+ Add College</button>
        </div>

        {/* Amenities */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-4">Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(AMENITY_LABELS).map(([key, label]) => (
              <label key={key} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors text-sm ${form.amenities[key] ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-200'}`}>
                <input type="checkbox" checked={form.amenities[key]} onChange={(e) => set(`amenities.${key}`, e.target.checked)} className="hidden" />
                <span>{label}</span>
                {form.amenities[key] && <span className="ml-auto text-primary-500">✓</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-4">Property Images</h3>
          <input type="file" multiple accept="image/*" onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer" />
          <p className="text-xs text-gray-400 mt-2">Upload up to 10 images. Max 5MB each. {isEdit && 'New uploads will be added to existing images.'}</p>
          {/* Preview existing images */}
          {form.images?.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {form.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img.url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <button type="button" onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3 disabled:opacity-60 text-sm">
            {submitting ? '⏳ Saving...' : isEdit ? '✅ Update Property' : '🏠 List Property'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-outline flex-1 py-3 text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
