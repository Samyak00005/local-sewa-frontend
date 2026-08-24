import { useEffect, useState } from "react";

import ProviderSidebar from "../../components/serviceprovider/ProviderSidebar";
import ProviderTopBar from "../../components/serviceprovider/ProviderTopBar";
import ProviderBottomNav from "../../components/serviceprovider/ProviderBottomNav";
import { invalidateServiceDirectory } from "../../hooks/useServiceDirectory";
import { apiRequest } from "../../lib/api";

function ProviderServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryChoice, setCategoryChoice] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryMessage, setCategoryMessage] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [serviceToRemove, setServiceToRemove] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiRequest("/api/provider/services"),
      apiRequest("/api/categories", { token: null }),
      apiRequest("/api/provider/dashboard"),
    ])
      .then(([serviceData, categoryData, dashboardData]) => {
        if (!cancelled) {
          setServices(serviceData.services || []);
          setCategories(categoryData.categories || []);
          setCategoryChoice(dashboardData.provider?.category || "");
        }
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveCategory = async (event) => {
    event.preventDefault();
    if (savingCategory) return;

    const customValue = customCategory.trim().replace(/\s+/g, " ");
    if (!categoryChoice) {
      setCategoryError("Please select a business category.");
      return;
    }
    if (categoryChoice === "__custom__" && customValue.length < 3) {
      setCategoryError("Enter a custom category with at least 3 characters.");
      return;
    }
    if (categoryChoice === "__custom__" && !/^[\p{L}\p{N}][\p{L}\p{N}\s&\-/,().+]*$/u.test(customValue)) {
      setCategoryError("Please enter a valid custom service category.");
      return;
    }

    setSavingCategory(true);
    setCategoryError("");
    setCategoryMessage("");
    try {
      const data = await apiRequest("/api/provider/category", {
        method: "PUT",
        body: {
          category: categoryChoice === "__custom__" ? "" : categoryChoice,
          custom_category: categoryChoice === "__custom__" ? customValue : null,
        },
      });
      const savedCategory = data.category;
      setCategories((current) => current.some((category) => category.id === savedCategory.id)
        ? current
        : [...current, savedCategory]);
      setCategoryChoice(savedCategory.name);
      setCustomCategory("");
      invalidateServiceDirectory();
      setCategoryMessage(data.message || "Business category updated.");
    } catch (requestError) {
      setCategoryError(requestError.message);
    } finally {
      setSavingCategory(false);
    }
  };

  const saveService = async (event) => {
    event.preventDefault();
    if (!serviceName.trim()) return;
    setSaving(true);
    setError("");
    try {
      const path = editingService ? `/api/provider/services/${editingService.id}` : "/api/provider/services";
      const data = await apiRequest(path, {
        method: editingService ? "PUT" : "POST",
        body: { name: serviceName.trim(), description: description.trim() || null, price: Number(price) || 0 },
      });
      setServices((current) => editingService
        ? current.map((service) => service.id === editingService.id ? data.service : service)
        : [data.service, ...current]);
      setServiceName("");
      setPrice("");
      setDescription("");
      setEditingService(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const beginEditing = (service) => {
    setEditingService(service);
    setServiceName(service.name || "");
    setDescription(service.description || "");
    setPrice(service.price ?? "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingService(null);
    setServiceName("");
    setDescription("");
    setPrice("");
  };

  const deleteService = async () => {
    if (!serviceToRemove || deletingId) return;
    const id = serviceToRemove.id;
    setDeletingId(id);
    setDeleteError("");
    setError("");
    try {
      await apiRequest(`/api/provider/services/${id}`, { method: "DELETE" });
      setServices((current) => current.filter((service) => service.id !== id));
      setServiceToRemove(null);
    } catch (requestError) {
      setDeleteError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#DCE9E1]">
      <div className="flex">
        <ProviderSidebar />

        <div className="min-w-0 flex-1">
          <ProviderTopBar title="My Services" />

          <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6">
            <h1 className="text-2xl font-extrabold text-[#10231A]">
              My Services
            </h1>

            <p className="mt-1 text-sm text-[#64748B]">
              Add services that you provide to customers.
            </p>

            {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

            <form onSubmit={saveCategory} className="mt-5 rounded-[20px] border border-[#BBF7D0] bg-[#F0FDF4] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-extrabold text-[#10231A]">Business category</h2>
                  <p className="mt-1 text-xs leading-5 text-[#527060]">Shown to customers in All Services.</p>
                </div>
                <span className="inline-flex w-fit shrink-0 rounded-full bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#15803D]">Customer visible</span>
              </div>

              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2.5">
                <select
                  value={categoryChoice}
                  onChange={(event) => { setCategoryChoice(event.target.value); setCategoryError(""); setCategoryMessage(""); }}
                  className="h-10 min-w-0 rounded-xl border border-[#86EFAC] bg-white px-3 text-sm font-semibold text-[#334155] outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#DCFCE7]"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
                  <option value="__custom__">Other — Add a new category</option>
                </select>
                <button type="submit" disabled={savingCategory} className="h-10 rounded-xl bg-[#15803D] px-4 text-sm font-bold text-white transition hover:bg-[#166534] disabled:cursor-wait disabled:opacity-60">
                  {savingCategory ? "Saving..." : "Save"}
                </button>
              </div>

              {categoryChoice === "__custom__" && (
                <input
                  value={customCategory}
                  onChange={(event) => { setCustomCategory(event.target.value); setCategoryError(""); }}
                  maxLength={100}
                  placeholder="New category, e.g. Drone Photography"
                  className="mt-2.5 h-10 w-full rounded-xl border border-[#86EFAC] bg-white px-3 text-sm outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#DCFCE7]"
                />
              )}
              {categoryError && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{categoryError}</p>}
              {categoryMessage && <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#15803D]">{categoryMessage}</p>}
            </form>

            {/* Add service */}

            <form
              onSubmit={saveService}
              className="mt-4 rounded-[20px] border border-[#E5EDE8] bg-white p-4"
            >
              <h2 className="font-bold text-[#10231A]">
                {editingService ? "Edit Service" : "Add New Service"}
              </h2>

              <div className="mt-3 grid gap-2.5 sm:grid-cols-[1fr_180px]">
                <input
                  required
                  value={serviceName}
                  onChange={(e) =>
                    setServiceName(e.target.value)
                  }
                  placeholder="Service name"
                  className="
                    h-10
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    px-4
                    text-sm
                    outline-none
                    focus:border-[#16A34A]
                  "
                />

                <input
                  type="number"
                  min="0"
                  max="1000000"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  placeholder="Starting price"
                  className="
                    h-10
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    px-4
                    text-sm
                    outline-none
                    focus:border-[#16A34A]
                  "
                />

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={500}
                  rows={2}
                  placeholder="Describe what is included (optional)"
                  className="resize-none rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#16A34A] sm:col-span-2"
                />

                <div className="flex gap-2 sm:col-span-2 sm:justify-end">
                {editingService && (
                  <button type="button" onClick={cancelEditing} className="h-10 rounded-xl border border-[#DDE9E1] px-5 text-sm font-bold text-[#64748B]">Cancel</button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="
                    h-10
                    rounded-xl
                    bg-[#16A34A]
                    px-5
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {saving ? "Saving..." : editingService ? "Save Changes" : "Add Service"}
                </button>
              </div>
              </div>
            </form>

            {/* Service list */}

            <section className="mt-10 border-t border-[#BFD1C5] pt-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2E6B49]">Your catalog</p>
                  <h2 className="mt-1 text-lg font-extrabold text-[#10231A]">Services You Provide</h2>
                  <p className="mt-1 text-xs text-[#64748B]">These services are visible to customers.</p>
                </div>
                {!loading && <span className="shrink-0 rounded-full bg-[#EDF4EF] px-3 py-1 text-xs font-bold text-[#315844]">{services.length} total</span>}
              </div>

              <div className="mt-4 space-y-3">
                {loading && <p className="text-sm font-semibold text-[#64748B]">Loading services...</p>}

              {services.map((service) => (
                <div
                  key={service.id}
                  className="
                    flex
                    flex-col
                    items-start
                    justify-between
                    gap-4
                    rounded-[18px]
                    border
                    border-[#E5EDE8]
                    bg-white
                    p-4
                    sm:flex-row
                    sm:items-center
                  "
                >
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#10231A]">
                      {service.name}
                    </h3>

                    <p className="mt-1 text-sm text-[#16A34A]">
                      Starting ₹{service.price}
                    </p>
                    {service.description && <p className="mt-1 max-w-2xl text-xs leading-5 text-[#64748B]">{service.description}</p>}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => beginEditing(service)} className="rounded-xl bg-[#ECFDF3] px-3 py-2 text-xs font-bold text-[#15803D]">Edit</button>
                    <button type="button" onClick={() => { setDeleteError(""); setServiceToRemove(service); }} className="rounded-xl bg-[#FEF2F2] px-3 py-2 text-xs font-bold text-[#DC2626]">Remove</button>
                  </div>
                </div>
              ))}

              {!loading && services.length === 0 && (
                <div className="rounded-[18px] border border-[#E5EDE8] bg-white p-8 text-center text-sm text-[#64748B]">
                  No services added yet.
                </div>
              )}
              </div>
            </section>
          </main>
        </div>
      </div>

      <ProviderBottomNav />

      {serviceToRemove && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0F172A]/45 p-4 backdrop-blur-[2px] sm:items-center" role="dialog" aria-modal="true" aria-labelledby="remove-service-title">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.3)]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600">Remove service</p>
            <h2 id="remove-service-title" className="mt-2 text-xl font-extrabold text-[#10231A]">Remove {serviceToRemove.name}?</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">It will no longer appear on your public provider profile. Existing bookings will not be deleted.</p>
            {deleteError && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{deleteError}</p>}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setServiceToRemove(null)} disabled={Boolean(deletingId)} className="h-11 rounded-xl border border-[#DDE9E1] text-sm font-bold text-[#64748B]">Keep</button>
              <button type="button" onClick={deleteService} disabled={Boolean(deletingId)} className="h-11 rounded-xl bg-[#DC2626] text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60">{deletingId ? "Removing..." : "Remove"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderServicesPage;
