import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Eye, Layout, Save } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../quill-theme.css';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';
import ConfirmModal from '../../../components/ConfirmModal';

const minimalModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ]
};

export default function CustomPagesTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  
  const [pages, setPages] = useState(settings.customPages || []);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', slug: '', content: '', isPublished: false });
  const [pageToDelete, setPageToDelete] = useState(null);

  useEffect(() => {
    if (settings._loaded) {
      setPages(settings.customPages || []);
    }
  }, [settings._loaded, settings.customPages]);

  const saveToStore = async (newPages) => {
    try {
      await settings.updateSettings({ customPages: newPages }, token);
      toast.success('Custom pages saved!');
    } catch {
      toast.error('Failed to save pages.');
    }
  };

  const handleAdd = () => {
    const newPage = { id: Date.now(), title: 'New Page', slug: 'new-page', content: 'Page content goes here...', isPublished: false };
    setPages([...pages, newPage]);
    setEditingId(newPage.id);
    setEditForm(newPage);
  };

  const handleEdit = (page) => {
    setEditingId(page.id);
    setEditForm(page);
  };

  const handleSave = () => {
    const newPages = pages.map(p => p.id === editingId ? { ...p, ...editForm } : p);
    setPages(newPages);
    setEditingId(null);
    saveToStore(newPages);
  };

  const handleDelete = (id) => {
    setPageToDelete(id);
  };

  const confirmDelete = () => {
    if (!pageToDelete) return;
    const newPages = pages.filter(p => p.id !== pageToDelete);
    setPages(newPages);
    saveToStore(newPages);
    setPageToDelete(null);
  };

  // Helper to generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setEditForm({ ...editForm, title, slug: editForm.slug || slug });
  };

  return (
    <div className="bg-white border border-black/10 p-6 space-y-6">
      {pageToDelete && (
        <ConfirmModal 
          title="Delete Custom Page"
          message="Are you sure you want to delete this page? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setPageToDelete(null)}
          confirmText="Delete"
        />
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-black/10 pb-3">
        <div>
          <h2 className="font-serif text-xl">Custom Pages (Legal & Info)</h2>
          <p className="text-xs text-gray-500 tracking-wider mt-1">Create rich-text pages for Privacy, Terms, Shipping, etc.</p>
        </div>
        <button onClick={handleAdd} className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800">
          <Plus size={14} /> Create Page
        </button>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.id} className="border border-black/10 p-4 relative group">
            {editingId === page.id ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Page Title</label>
                    <input 
                      type="text" 
                      value={editForm.title} 
                      onChange={handleTitleChange}
                      className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black font-serif" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">URL Slug</label>
                    <div className="flex items-center">
                      <span className="text-gray-400 bg-gray-50 border border-r-0 border-black/20 p-2 text-sm">/pages/</span>
                      <input 
                        type="text" 
                        value={editForm.slug} 
                        onChange={e => setEditForm({...editForm, slug: e.target.value})}
                        className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black" 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Page Content (Rich Text / HTML)</label>
                  <ReactQuill 
                    theme="snow"
                    modules={minimalModules}
                    value={editForm.content} 
                    onChange={content => {
                      if (content !== editForm.content) {
                        setEditForm(prev => ({...prev, content}));
                      }
                    }}
                    className="bg-white border-black/20 font-sans" 
                    placeholder="Enter your content here..."
                  />
                </div>

                <div className="flex items-center gap-6 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editForm.isPublished} 
                      onChange={e => setEditForm({...editForm, isPublished: e.target.checked})}
                      className="w-4 h-4 accent-black" 
                    />
                    <span className="text-[10px] uppercase tracking-widest font-semibold">Publish Page (Make visible on site)</span>
                  </label>
                </div>

                <div className="mt-4 pt-4 border-t border-black/10">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Add Link to Footer Section (Optional)</label>
                  <select 
                    value={editForm.addToFooterColumn || ''}
                    onChange={e => setEditForm({...editForm, addToFooterColumn: e.target.value})}
                    className="w-full sm:w-1/2 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="">-- Do not add to footer --</option>
                    {(settings.footerData?.columns || []).map(col => (
                      <option key={col.id} value={col.id}>Footer Column: {col.title}</option>
                    ))}
                    <option value="legal">Bottom Bar (Legal Links / Privacy Policy)</option>
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1 italic">
                    If selected, a link to this page will be added to the chosen footer section. You can manage links later in the Header & Footer tab.
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => {
                    const newPages = pages.map(p => p.id === editingId ? { ...p, title: editForm.title, slug: editForm.slug, content: editForm.content, isPublished: editForm.isPublished } : p);
                    setPages(newPages);
                    setEditingId(null);
                    
                    let newFooterData = null;
                    if (editForm.addToFooterColumn) {
                       const fd = settings.footerData;
                       if (fd) {
                         const pageUrl = '/pages/' + editForm.slug;
                         if (editForm.addToFooterColumn === 'legal') {
                           const legalLinks = fd.legalLinks || [];
                           if (!legalLinks.some(l => l.url === pageUrl)) {
                             newFooterData = {
                               ...fd,
                               legalLinks: [...legalLinks, { id: Date.now(), name: editForm.title, url: pageUrl }]
                             };
                           }
                         } else {
                           const colId = parseInt(editForm.addToFooterColumn);
                           if (fd.columns) {
                             const targetCol = fd.columns.find(c => c.id === colId);
                             if (targetCol && !targetCol.links.some(l => l.url === pageUrl)) {
                               newFooterData = {
                                 ...fd,
                                 columns: fd.columns.map(c => 
                                   c.id === colId ? { ...c, links: [...c.links, { id: Date.now(), name: editForm.title, url: pageUrl }] } : c
                                 )
                               };
                             }
                           }
                         }
                       }
                    }
                    
                    const payload = { customPages: newPages };
                    if (newFooterData) {
                      payload.footerData = newFooterData;
                    }
                    
                    settings.updateSettings(payload, token)
                      .then(() => toast.success('Custom page saved!'))
                      .catch(() => toast.error('Failed to save page.'));
                  }} className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest">Save Page</button>
                  <button onClick={() => setEditingId(null)} className="border border-black/20 px-4 py-2 text-xs uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 shrink-0"><Layout size={20} className="text-gray-400" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg">{page.title}</h3>
                    {!page.isPublished && <span className="bg-gray-100 text-gray-500 text-[9px] uppercase tracking-widest px-2 py-0.5">Draft</span>}
                    {page.isPublished && <span className="bg-green-50 text-green-600 border border-green-200 text-[9px] uppercase tracking-widest px-2 py-0.5">Live</span>}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                    URL: /pages/{page.slug}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black flex items-center gap-1 text-[10px] uppercase tracking-widest mr-2 no-underline">
                    <Eye size={14} /> Preview
                  </a>
                  <button onClick={() => handleEdit(page)} className="text-gray-400 hover:text-black"><Edit3 size={16} /></button>
                  <button onClick={() => handleDelete(page.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {pages.length === 0 && <p className="text-sm text-gray-500 py-8 text-center border-2 border-dashed border-gray-200">No custom pages created yet.</p>}
      </div>
    </div>
  );
}
