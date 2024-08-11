import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux';
import { selectAllBrands, selectAllCategories, selectProductById, fecthProductByIdAsync,createProductAsync, updateProductAsync, clearSelectedProduct  } from '../../product/productSlice';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const colors = [
  { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400', id:"white" },
  { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400', id:"gray" },
  { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900', id:"black" },
];

const sizes = [
  { name: 'XXS', inStock: true, id:"xxs" },
  { name: 'XS', inStock: true, id:"xs" },
  { name: 'S', inStock: true, id:"s" },
  { name: 'M', inStock: true, id:"m" },
  { name: 'L', inStock: true, id:"l" },
  { name: 'XL', inStock: true, id:"xl" },
  { name: '2XL', inStock: true, id:"2xl" },
  { name: '3XL', inStock: true, id:"3xl" },
];

export default function ProductForm() {
  // TODO: cancel button functionality
  // TODO: product out of stock warning
  // TODO solve: previous selected product details when clicking on add product
    const dispatch = useDispatch();
    const categories = useSelector(selectAllCategories);
    const brands = useSelector(selectAllBrands);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();
    const params = useParams();
    const selectedProduct = useSelector(selectProductById);

    const handleDelete = ()=>{
      const product = {...selectedProduct};
      product.deleted = true;
      dispatch(updateProductAsync(product));
    }

    useEffect(()=>{
      if(params.id){
        dispatch(fecthProductByIdAsync(params.id));
      }
    },[params.id,dispatch])

    useEffect(()=>{
      if(selectedProduct){
        for (let key in selectedProduct) {
          setValue(key, selectedProduct[key]);
        }
        const images = selectedProduct.images;
        images.map((image,index)=>setValue(`image${index+1}`,image));
        const highlights = selectedProduct.highlights;
        if(highlights){
          highlights.map((highlight,index)=>setValue(`highlight${index+1}`,highlight));
        }
        const sizes = selectedProduct.sizes.map(size=>size.id);
        const colors = selectedProduct.colors.map(color=>color.id);
        if(sizes){
          setValue("sizes",sizes);
        }
        if(colors){
          setValue("colors",colors);
        }
      }
    },[selectedProduct,setValue]);

    // clear form on componentUnmount
    useEffect(()=>{
      return ()=>dispatch(clearSelectedProduct());
    },[])

  return (
    <div className='m-20'>
    <form className="space-y-6" noValidate onSubmit={handleSubmit((data)=>{
      // formating received form data into product format
        let product = {...data};
        product.images = [product.image1,product.image2,product.image3,product.image4];
        product.highlights = [product.highlight1,product.highlight2,product.highlight3,product.highlight4];
        delete product.image1;
        delete product.image2;
        delete product.image3;
        delete product.image4;
        product.price = +product.price;
        product.discountPercentage = +product.discountPercentage;
        product.stock = +product.stock;
        product.rating = 0;
        if(product.colors){
          product.colors = product.colors.map(color=>colors.find(clr=>color===clr.id));
        }
        if(product.sizes){
          product.sizes = product.sizes.map(size=>sizes.find(sz=>size===sz.id));
        }
        if(params.id){
          product.id = params.id;
          product.rating = selectedProduct.rating;
          dispatch(updateProductAsync(product));
        }
        else{
          dispatch(createProductAsync(product));
          // TODO: on product successfully added show a message
        }
        reset();
          })}>
      <div className="space-y-12 bg-white p-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Add Product</h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Product Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("title",{required: "product title is required"})}
                    id="title"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  {...register("description",{required: "product description is required"})}
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="brand" className="block text-sm font-medium leading-6 text-gray-900">
                Brand
              </label>
              <div className="mt-2">
                <select {...register("brand",{required: "product brand is required"})} id='brand'>
                <option value="">--choose brand--</option>
                    {
                        brands.map((brand)=><option value={brand.value}>{brand.label}</option>)
                    }
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="colors" className="block text-sm font-medium leading-6 text-gray-900">
                Colors
              </label>
              <div className="mt-2">
              {
                  colors.map((color)=><><input type='checkbox' {...register("colors")} key={color.id} value={color.id}/>{color.name}{"  "}</>)
              }
              </div>
            </div>
            <div className="col-span-full">
              <label htmlFor="sizes" className="block text-sm font-medium leading-6 text-gray-900">
                Sizes
              </label>
              <div className="mt-2">
              {
                  sizes.map((size)=><><input type='checkbox' {...register("sizes")} key={size.id} value={size.id}/>{size.name}{"  "}</>)
              }
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                Categories
              </label>
              <div className="mt-2">
                <select {...register("category",{required: "product category is required"})} id='category'>
                <option value="">--choose category--</option>
                    {
                        categories.map((category)=><option value={category.value}>{category.label}</option>)
                    }
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                Price
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="number"
                    {...register("price",{required: "product price is required",
                    min: 1,
                    max:99999    
                })}
                    id="price"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="discountPercentage" className="block text-sm font-medium leading-6 text-gray-900">
                Discount
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="number"
                    {...register("discountPercentage",{required: "product discount is required",min:0,max:100})}
                    id="discountPercentage"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">
                Stock
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="number"
                    {...register("stock",{required: "product stock is required",min:0})}
                    id="stock"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="thumbnail" className="block text-sm font-medium leading-6 text-gray-900">
                Thumbnail
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("thumbnail",{required: "product thumbnail is required"})}
                    id="thumbnail"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="image1" className="block text-sm font-medium leading-6 text-gray-900">
                Image 1
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("image1",{required: "product image1 is required"})}
                    id="image1"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="image2" className="block text-sm font-medium leading-6 text-gray-900">
                Image 2
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("image2",{required: "product image2 is required"})}
                    id="image2"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="image3" className="block text-sm font-medium leading-6 text-gray-900">
                Image 3
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("image3",{required: "product image3 is required"})}
                    id="image3"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="image4" className="block text-sm font-medium leading-6 text-gray-900">
                Image 4
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("image4",{required: "product image4 is required"})}
                    id="image4"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="highlight1" className="block text-sm font-medium leading-6 text-gray-900">
                Highlight 1
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("highlight1",{required: "product highlight1 is required"})}
                    id="highlight1"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="highlight2" className="block text-sm font-medium leading-6 text-gray-900">
                Highlight 2
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("highlight2",{required: "product highlight1 is required"})}
                    id="highlight2"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="highlight3" className="block text-sm font-medium leading-6 text-gray-900">
                Highlight 3
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("highlight3",{required: "product highlight3 is required"})}
                    id="highlight3"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="highlight4" className="block text-sm font-medium leading-6 text-gray-900">
                Highlight 4
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    {...register("highlight4",{required: "product highlight4 is required"})}
                    id="highlight4"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Extra</h2>
          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                      Comments
                    </label>
                    <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="candidates"
                      name="candidates"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="candidates" className="font-medium text-gray-900">
                      Candidates
                    </label>
                    <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="offers" className="font-medium text-gray-900">
                      Offers
                    </label>
                    <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>

        {selectedProduct && <button
          type="button"
          onClick={handleDelete}
          className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Delete
        </button>}

        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
    </div>
  )
}
