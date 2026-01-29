import type { SortOption } from '../components/SortControl';

// ... existing imports ...
import { useState, useCallback, useTransition, useEffect } from 'react';
import { api } from '../services/api';

const cache = new Map<string, Promise<any>>();

function fetchWithSuspense(url: string) {
  if (!cache.has(url)) {
    const promise = api.get(url).then(async (res) => {
        return res;
    });
    cache.set(url, promise);
  }
  return cache.get(url)!;
}

const ITEMS_PER_PAGE = 10;

export function useDashboard() {
  const [searchQuery, setSearchQuery] = useState(() => {
    return new URLSearchParams(window.location.search).get('search') || '';
  });
  
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = new URLSearchParams(window.location.search).get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });

  const [sortOption, setSortOption] = useState<SortOption>(() => {
    const params = new URLSearchParams(window.location.search);
    const sortBy = params.get('sortBy');
    const order = params.get('order');

    if (sortBy === 'fullName' && order === 'ASC') return 'nameAsc';
    if (sortBy === 'fullName' && order === 'DESC') return 'nameDesc';
    if (sortBy === 'createdAt' && order === 'ASC') return 'oldest';
    return 'newest';
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') ? parseInt(params.get('page')!, 10) : 1;
      const search = params.get('search') || '';
      
      setCurrentPage(page);
      setSearchQuery(search);
      setFetchUrl(getFetchUrl(page, search, sortOption));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const getFetchUrl = (page: number, search: string, sort: SortOption) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    let sortBy = 'createdAt';
    let order = 'DESC';

    switch (sort) {
        case 'oldest': sortBy = 'createdAt'; order = 'ASC'; break;
        case 'nameAsc': sortBy = 'fullName'; order = 'ASC'; break;
        case 'nameDesc': sortBy = 'fullName'; order = 'DESC'; break;
        case 'newest': default: sortBy = 'createdAt'; order = 'DESC'; break;
    }

    return `/patients?limit=${ITEMS_PER_PAGE}&offset=${offset}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&order=${order}`;
  };

  const [fetchUrl, setFetchUrl] = useState(getFetchUrl(currentPage, searchQuery, sortOption));
  
  const updateState = (page: number, search: string, sort: SortOption) => {
    const url = new URL(window.location.href);
    if (search) url.searchParams.set('search', search);
    else url.searchParams.delete('search');
    
    if (page > 1) url.searchParams.set('page', page.toString());
    else url.searchParams.delete('page');

    let sortBy = 'createdAt';
    let order = 'DESC';
    switch (sort) {
        case 'oldest': sortBy = 'createdAt'; order = 'ASC'; break;
        case 'nameAsc': sortBy = 'fullName'; order = 'ASC'; break;
        case 'nameDesc': sortBy = 'fullName'; order = 'DESC'; break;
        case 'newest': default: sortBy = 'createdAt'; order = 'DESC'; break;
    }
    url.searchParams.set('sortBy', sortBy);
    url.searchParams.set('order', order);

    window.history.pushState({}, '', url);
    
    startTransition(() => {
      setFetchUrl(getFetchUrl(page, search, sort));
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateState(1, query, sortOption);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateState(page, searchQuery, sortOption);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
    updateState(1, searchQuery, option);
  };

  const patientsPromise = fetchWithSuspense(fetchUrl);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddPatient = useCallback(() => {
    setIsRegisterModalOpen(true);
  }, []);

  const handleRegisterSuccess = useCallback(() => {
    setIsRegisterModalOpen(false);
    setShowSuccess(true);
    cache.delete(fetchUrl); 
    setFetchUrl(prev => `${prev}&t=${Date.now()}`);
  }, [fetchUrl]);

  const togglePatientExpansion = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    currentPage,
    handlePageChange,
    patientsPromise,
    isPending,
    expandedId,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    showSuccess,
    setShowSuccess,
    handleAddPatient,
    handleRegisterSuccess,
    togglePatientExpansion,
    sortOption,
    handleSortChange
  };
}

