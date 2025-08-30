import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  BuildingStorefrontIcon,
  RocketLaunchIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'Productos', to: '/', icon: BuildingStorefrontIcon },
  { name: 'Ventas', to: '/ventas', icon: RocketLaunchIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            {/* Sidebar content */}
            <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div className="relative flex h-16 shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/1024px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png"
                  className="h-8 w-auto"
                />
              </div>
              <nav className="relative flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                              classNames(
                                isActive ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                              )
                            }
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon aria-hidden="true" className="size-6 shrink-0" />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>

                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar (desktop) */}
      <div className="hidden bg-gray-900 ring-1 ring-white/10 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Your Company"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/1024px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png"
              className="h-12 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          classNames(
                            isActive ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                          )
                        }
                      >
                        <item.icon aria-hidden="true" className="size-6 shrink-0" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

            </ul>
          </nav>
        </div>
      </div>

      {/* Top bar + content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form action="#" method="GET" className="grid flex-1 grid-cols-1">
            </form>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">View notifications</span>
              </button>

              <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="relative flex items-center">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png"
                    className="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5"
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900">
                      Usuario
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                  </span>
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg outline outline-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        Cerrar sesión
                      </a>
                    </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="px-4 py-5 sm:p-6">
              <Outlet />
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  )
}
