import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PropertyForm from '../../components/dashboard/PropertyForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(({ data }) => setProperty(data.data))
      .catch(() => { toast.error('Property not found'); navigate('/dashboard'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  return <PropertyForm existing={property} />;
};

export default EditProperty;
